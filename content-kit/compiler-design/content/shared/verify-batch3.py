"""Verify semantic models and published Batch 3 tables with independent value oracles.

Run from content-kit: python3 -I -X utf8 -W error
compiler-design/content/shared/verify-batch3.py. No files are changed by this script.
"""

import ast
from html.parser import HTMLParser
from itertools import product
from pathlib import Path
import random
import re
import runpy


ROOT = Path(__file__).resolve().parents[1]
EXPR = runpy.run_path(str(ROOT / "shared/expression-model.py"))
TYPES = runpy.run_path(str(ROOT / "shared/type-model.py"))
SYMBOLS = runpy.run_path(str(ROOT / "shared/symbol-model.py"))
BLOCKS = runpy.run_path(str(ROOT / "shared/block-model.py"))
PARSING = runpy.run_path(str(ROOT / "shared/parsing-models.py"))
NEW_MODULES = ("semantic-analysis", "intermediate-code", "runtime-codegen", "practice-exam")


class Tables(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tables = {}
        self.rows = []
        self.row = []
        self.buffer = None
        self.caption = ""
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.rows = []
        elif tag == "tr":
            self.row = []
        elif tag in {"td", "th", "caption"}:
            self.buffer = []

    def handle_data(self, data):
        if self.buffer is not None:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if tag in {"td", "th", "caption"} and self.buffer is not None:
            value = " ".join("".join(self.buffer).split())
            if tag == "caption":
                self.caption = value
            else:
                self.row.append(value)
            self.buffer = None
        elif tag == "tr":
            self.rows.append(self.row)
        elif tag == "table":
            assert self.caption not in self.tables
            self.tables[self.caption] = self.rows


def published(module, topic):
    return Tables((ROOT / "topics" / module / topic / "body.en.html").read_text()).tables


def fails(exception, function, *args):
    try:
        function(*args)
    except exception:
        return
    raise AssertionError(("expected failure", function.__name__, args))


def oracle(node, environment):
    """Evaluate an independently parsed Python AST restricted to the common subset."""
    if isinstance(node, ast.Expression):
        return oracle(node.body, environment)
    if isinstance(node, ast.Constant) and type(node.value) is int:
        return node.value
    if isinstance(node, ast.Name):
        return environment[node.id]
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub):
        return -oracle(node.operand, environment)
    if isinstance(node, ast.BinOp):
        left, right = oracle(node.left, environment), oracle(node.right, environment)
        if isinstance(node.op, ast.Add):
            return left + right
        if isinstance(node.op, ast.Sub):
            return left - right
        if isinstance(node.op, ast.Mult):
            return left * right
    raise AssertionError(ast.dump(node))


def value(text, environment):
    return oracle(ast.parse(text.strip(), mode="eval"), environment)


def run_tac(rows, result, environment, input_names):
    values = dict(environment)
    inputs = input_names
    defined = set()

    def operand(name):
        return int(name) if name.isdecimal() else values[name]

    for op, left, right, target in rows:
        assert target not in inputs and target not in defined
        first = operand(left)
        if op == "neg":
            assert right == "-"
            answer = -first
        else:
            second = operand(right)
            answer = {"+": lambda: first + second, "-": lambda: first - second,
                      "*": lambda: first * second}[op]()
        values[target] = answer
        defined.add(target)
    return operand(result)


def check_expressions():
    randomizer = random.Random(312)
    leaves = ["0", "1", "2", "7", "marks", "t1", "t2"]

    def expression(depth):
        if not depth or randomizer.random() < 0.3:
            return randomizer.choice(leaves)
        if randomizer.random() < 0.2:
            return "-(" + expression(depth - 1) + ")"
        return ("(" + expression(depth - 1) + randomizer.choice("+-*")
                + expression(depth - 1) + ")")

    sources = [expression(4) for _ in range(1200)]
    sources += ["10-3-2", "8-3*2", "-2*3", "--2", "t1+t2*x", "(3+4)*5"]
    count = 0
    for environment in ({"marks": 40, "t1": 2, "t2": 3, "x": 4},
                        {"marks": -7, "t1": 0, "t2": -2, "x": 9},
                        {"marks": 0, "t1": 9, "t2": 1, "x": -3}):
        for source in sources:
            tree = EXPR["parse"](source)
            expected = value(source, environment)
            assert EXPR["evaluate"](tree, environment) == expected, source
            assert EXPR["annotate"](tree, environment)[-1][2] == expected, source
            rows, result = EXPR["generate_tac"](tree)
            input_names = {node.id for node in ast.walk(ast.parse(source))
                           if isinstance(node, ast.Name)}
            assert run_tac(rows, result, environment, input_names) == expected, source
            count += 1
    assert EXPR["evaluate"](EXPR["parse"]("007")) == 7
    for source in ("", "+2", "2+", "2**3", "(2", "2)", "()", "2 3", "a=2",
                   "2/3", "@", "২", "2.5", "f(2)", "2+(3*)"):
        fails(EXPR["LanguageError"], EXPR["parse"], source)
    fails(EXPR["LanguageError"], EXPR["evaluate"], EXPR["parse"]("missing+1"))
    tokens = EXPR["scan"]("1 +\n\tmarks")
    assert [(t.line, t.column) for t in tokens] == [(1, 1), (1, 3), (2, 2), (2, 7)]
    print(f"Expressions: {count} evaluator/annotation/TAC comparisons; invalid syntax and positions passed")


def check_types_and_scopes():
    environment = {"i": "int", "r": "real", "b": "bool", "a": ("array", 3, "int")}
    for left, right in product("irb", repeat=2):
        expression = ("add", ("var", left), ("var", right))
        if "b" in (left, right):
            fails(TypeError, TYPES["type_of"], expression, environment)
        else:
            expected = "real" if "r" in (left, right) else "int"
            assert TYPES["type_of"](expression, environment) == expected
            assert TYPES["type_of"](("lt", expression[1], expression[2]), environment) == "bool"
    for source, target in product(("int", "real", "bool"), repeat=2):
        if source == target or (source, target) == ("int", "real"):
            assert TYPES["conversion"](source, target) in {"identity", "int-to-real"}
        else:
            fails(TypeError, TYPES["conversion"], source, target)
    assert TYPES["type_of"](("lit", True), {}) == "bool"
    assert TYPES["type_of"](("index", ("var", "a"), ("lit", 1)), environment) == "int"
    fails(TypeError, TYPES["type_of"], ("index", ("var", "a"), ("lit", True)), environment)
    fails(TypeError, TYPES["type_of"], ("index", ("var", "i"), ("lit", 0)), environment)
    fails(TypeError, TYPES["type_of"], ("var", "missing"), environment)
    assert TYPES["conversion"](("array", 3, "int"), ("array", 3, "int")) == "identity"
    fails(TypeError, TYPES["conversion"], ("array", 3, "int"), ("array", 4, "int"))
    symbols = SYMBOLS["Symbols"]()
    reference = [{}]
    randomizer = random.Random(75)
    for _ in range(2000):
        operation = randomizer.choice(("enter", "leave", "declare", "lookup"))
        name = randomizer.choice(("marks", "fee", "bonus", "x"))
        if operation == "enter":
            symbols.enter()
            reference.append({})
        elif operation == "leave":
            if len(reference) == 1:
                fails(ValueError, symbols.leave)
            else:
                symbols.leave()
                reference.pop()
        elif operation == "declare":
            kind = randomizer.choice(("int", "real", "bool"))
            if name in reference[-1]:
                fails(ValueError, symbols.declare, name, kind)
            else:
                expected = (kind, len(reference) - 1, len(reference[-1]))
                entry = symbols.declare(name, kind)
                assert (entry.type_name, entry.depth, entry.slot) == expected
                reference[-1][name] = expected
        else:
            visible = [scope[name] for scope in reference if name in scope]
            if visible:
                entry = symbols.lookup(name)
                assert (entry.type_name, entry.depth, entry.slot) == visible[-1]
            else:
                fails(ValueError, symbols.lookup, name)
        assert len(symbols.scopes) == len(reference)
        for actual, expected in zip(symbols.scopes, reference):
            assert {key: (e.type_name, e.depth, e.slot) for key, e in actual.items()} == expected
    print("Types: scalar matrix, array and Boolean rules passed; scopes: 2000 reference-model operations passed")


def check_blocks():
    instruction = BLOCKS["Instruction"]
    count = 0
    assert BLOCKS["basic_blocks"]([]) == ([], [])
    for length in range(1, 5):
        variants = [instruction("assign", ""), instruction("return", "")]
        variants += [instruction(op, "", target) for op in ("if", "goto")
                     for target in range(length)]
        for code in product(variants, repeat=length):
            blocks, edges = BLOCKS["basic_blocks"](code)
            assert [i for block in blocks for i in block] == list(range(length))
            owner = {i: b for b, block in enumerate(blocks) for i in block}
            incoming_targets = {item.target for item in code if item.op in {"if", "goto"}}
            required_starts = {0} | incoming_targets
            required_starts |= {i + 1 for i, item in enumerate(code[:-1])
                                if item.op != "assign"}
            assert {b[0] for b in blocks} == required_starts
            for block, members in enumerate(blocks):
                assert all(code[i].op == "assign" for i in members[:-1])
                assert not (set(members[1:]) & incoming_targets)
                last_index = members[-1]
                last = code[last_index]
                # Instruction-level successor oracle, then lift endpoints to block owners.
                next_indices = set()
                if last.op in {"if", "goto"}:
                    next_indices.add(last.target)
                if last.op in {"assign", "if"} and last_index + 1 < length:
                    next_indices.add(last_index + 1)
                assert edges[block] == sorted({owner[i] for i in next_indices})
            count += 1
    for target in (-1, 1, None, True, "0"):
        fails(ValueError, BLOCKS["basic_blocks"], [instruction("goto", "", target)])
    fails(ValueError, BLOCKS["basic_blocks"], [instruction("unknown", "")])
    fails(ValueError, BLOCKS["basic_blocks"], [instruction("assign", "", 0)])
    print(f"Blocks: {count} exhaustive instruction lists (lengths 1..4), empty and invalid targets passed")


def set_text(value):
    return "{" + ",".join(sorted(value)) + "}"


def dataflow_rounds(neighbours, generate, remove):
    facts = [set() for _ in neighbours]
    inputs = [set() for _ in neighbours]
    history = [[f"{set_text(a)} / {set_text(b)}" for a, b in zip(inputs, facts)]]
    while True:
        new_inputs = [set().union(*(facts[p] for p in ns)) for ns in neighbours]
        updated = [g | (entry - kill) for g, entry, kill in zip(generate, new_inputs, remove)]
        history.append([f"{set_text(a)} / {set_text(b)}" for a, b in zip(new_inputs, updated)])
        if updated == facts and new_inputs == inputs:
            return history
        inputs, facts = new_inputs, updated


def check_dataflow():
    tables = published("runtime-codegen", "cd-data-flow-analysis")
    predecessors = [[], [0], [0], [1, 2]]
    successors = [[1, 2], [3], [3], []]
    generate = [{"d1", "d2"}, {"d3"}, {"d4"}, {"d5"}]
    kill = [{"d3", "d4"}, {"d1"}, {"d2"}, set()]
    rows = tables["Complete GEN and KILL sets for the diamond"][1:]
    assert [row[1:3] for row in rows] == [[set_text(g), set_text(k)]
                                               for g, k in zip(generate, kill)]
    actual = dataflow_rounds(predecessors, generate, kill)
    expected = [row[1:] for row in tables[
        "Complete reaching-definition iteration, each cell is IN / OUT"][1:]]
    assert actual == expected, (actual, expected)
    use = [set(), {"y"}, {"x"}, {"x", "y"}]
    definitions = [{"x", "y"}, {"x"}, {"y"}, {"z"}]
    rows = tables["Complete USE and DEF sets"][1:]
    assert [row[1:3] for row in rows] == [[set_text(u), set_text(d)]
                                               for u, d in zip(use, definitions)]
    # The forward solver's "entry / result" means OUT / IN for a backward problem.
    backward = dataflow_rounds(successors, use, definitions)
    backward = [[" / ".join(reversed(cell.split(" / "))) for cell in row] for row in backward]
    assert backward == [row[1:] for row in tables[
        "Complete live-variable rounds, each cell is IN / OUT"][1:]]
    loop = dataflow_rounds([[], [0, 1], [1]],
                          [{"d1", "d2"}, {"d3", "d4"}, set()],
                          [{"d3", "d4"}, {"d1", "d2"}, set()])
    assert loop == [row[1:] for row in tables[
        "Reaching definitions for the loop, each cell is IN / OUT"][1:]]
    print("Data-flow tables: every GEN/KILL, USE/DEF and synchronous fixed-point cell passed")


def execute_control(rows, environment):
    instructions = [row[1] for row in rows[1:]]
    env, output, pc = dict(environment), [], 0
    for _ in range(200):
        if pc == len(instructions):
            return env, output
        text = instructions[pc]
        branch = re.fullmatch(r"if (\w+) (<=|>=|<|>) (\w+) goto (\d+)", text)
        if branch:
            left, op, right, target = branch.groups()
            a, b = value(left, env), value(right, env)
            condition = {"<": a < b, ">": a > b, "<=": a <= b, ">=": a >= b}[op]
            pc = int(target) if condition else pc + 1
        elif text.startswith("goto "):
            pc = int(text.split()[1])
        elif text.startswith("print "):
            output.append(value(text[6:], env))
            pc += 1
        else:
            name, expression = text.split(" = ")
            env[name] = value(expression, env)
            pc += 1
    raise AssertionError("control table did not terminate within the bounded example")


def machine(rows, environment):
    state = dict(environment)
    for row in rows[1:]:
        for instruction in row[1].split("; "):
            op, arguments = instruction.split(" ", 1)
            left, right = arguments.split(",")
            right = right.strip()
            if op in {"LD", "ST"}:
                state[left] = state[right]
            elif op == "ADD":
                state[left] += state[right]
            elif op == "SUB":
                state[left] -= state[right]
            elif op == "MUL":
                state[left] *= state[right]
            else:
                raise AssertionError(instruction)
    return state


def check_control_and_machine():
    tables = published("intermediate-code", "cd-control-flow-translation")
    for a, b, c, d in product(range(-2, 4), repeat=4):
        env, output = execute_control(tables["Completed if-else TAC"],
                                      dict(a=a, b=b, c=c, d=d))
        assert output == [int(a < b and c < d)] and env["x"] == output[0]
    for i, n in product(range(-2, 7), repeat=2):
        env, output = execute_control(tables["Complete while translation"], dict(i=i, n=n))
        assert env["i"] == max(i, n) and output == [max(i, n)]
    codegen = published("runtime-codegen", "cd-code-generation")
    for a, b, c, d in product(range(-2, 3), repeat=4):
        env = dict(a=a, b=b, c=c, d=d)
        result = machine(codegen["Complete two-register selection trace"], env)
        assert result["result"] == (a + b) * (c - d)
    for inputs in product(range(-1, 2), repeat=6):
        env = dict(zip("abcdef", inputs))
        result = machine(codegen["Spill plan preserving all live values"], env)
        assert result["v"] == sum(inputs)
    print("Published TAC: 1296 if-else and 81 while paths passed; target code: 1354 register/spill cases passed")


def check_exam_tables():
    tables = published("practice-exam", "cd-exam-questions")
    grammar = {"S": [("A", "a")], "A": [("b",), ()]}
    first, follow = PARSING["first_follow"](grammar, "S")
    assert first == {"S": {"a", "b"}, "A": {"b", "ε"}}
    assert follow == {"S": {"$"}, "A": {"a"}}
    rows = tables["Fixed-point facts for the nullable-prefix grammar"][1:]
    assert [(row[0], row[2], row[3]) for row in rows] == [
        ("S", "{a,b}", "{$}"), ("A", "{b,ε}", "{a}")]
    ll = {row[0]: dict(zip(("a", "b", "$"), row[1:]))
          for row in tables["Complete LL(1) table"][1:]}
    lr = {int(row[0]): dict(zip(("a", "b", "$", "S"), row[1:]))
          for row in tables["Complete ACTION and GOTO table"][1:]}
    dfa = {row[0]: dict(zip(("a", "b"), row[2:4]))
           for row in tables["Every discovered DFA subset and transition"][1:]}
    rules = {"r1": ("A", "a"), "r2": ("b",), "r3": ()}

    def ll_accept(word):
        stack, stream, index = ["$", "S"], list(word) + ["$"], 0
        while stack:
            symbol = stack.pop()
            if symbol in ll:
                action = ll[symbol][stream[index]]
                if action == "error":
                    return False
                stack.extend(reversed(rules[action]))
            else:
                if symbol != stream[index]:
                    return False
                index += 1
        return index == len(stream)

    def slr_accept(word):
        stack, stream, index = [0], list(word) + ["$"], 0
        for _ in range(100):
            action = lr[stack[-1]][stream[index]]
            if action == "error":
                return False
            if action == "accept":
                return index == len(word)
            if action.startswith("s"):
                stack.append(int(action[1:]))
                index += 1
            else:
                size = 2 if action == "r1" else 1
                del stack[-size:]
                stack.append(int(lr[stack[-1]]["S"]))
        raise AssertionError("nonprogressing SLR table")

    count = 0
    for length in range(9):
        for tokens in product("ab", repeat=length):
            word = "".join(tokens)
            assert ll_accept(tokens) == (word in {"a", "ba"})
            expected = bool(re.fullmatch("a*b", word))
            assert slr_accept(tokens) == expected
            state = "A"
            for token in tokens:
                state = dfa[state][token]
            assert (state == "C") == expected
            count += 1
    # Check the published item sets and transitions against the prior general LR model.
    grammar = {"S": [("a", "S"), ("b",)]}
    rules, states, transitions = PARSING["lr_collection"](grammar, "S")
    expected_sets = []
    for state in states:
        expected_sets.append({PARSING["item_text"](rules, item).replace("->", "→").replace(" ", "") for item in state})
    printed_sets = [{item.strip().replace(" ", "") for item in row[1].split(";")}
                    for row in tables["Every LR(0) item in the SLR construction"][1:]]
    # State discovery numbering is allowed to differ; compare corresponding item identities.
    mapping = {i: expected_sets.index(item_set) for i, item_set in enumerate(printed_sets)}
    for source, symbol, target in tables["Every nonempty GOTO transition"][1:]:
        assert transitions[mapping[int(source[1:])], symbol] == mapping[int(target[1:])]
    assert len(transitions) == len(tables["Every nonempty GOTO transition"]) - 1
    print(f"Exam tables: FIRST/FOLLOW, full LR items/transitions and {count} LL(1)/SLR/DFA words passed")


def check_sources():
    sources = [source for module in NEW_MODULES
               for source in (ROOT / "topics" / module).rglob("*.py")]
    cores = [(ROOT / "shared" / filename).read_text() for filename in
             ("expression-model.py", "type-model.py", "symbol-model.py", "block-model.py")]
    for source in sources:
        text = source.read_text()
        ast.parse(text, str(source))
        assert any(text.startswith(core.rstrip()) for core in cores), source
    print(f"Sources: {len(sources)} standalone programs match the verified models and parse cleanly")


if __name__ == "__main__":
    check_expressions()
    check_types_and_scopes()
    check_blocks()
    check_dataflow()
    check_control_and_machine()
    check_exam_tables()
    check_sources()
    print("Batch 3 verification passed")
