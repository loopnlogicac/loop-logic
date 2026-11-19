"""Check published syntax-analysis tables and parsing behaviour with independent oracles.

Run from content-kit with Python 3.12. No third-party packages or file mutations.
"""

from html.parser import HTMLParser
from itertools import product
from pathlib import Path
import json
import random
import runpy


ROOT = Path(__file__).resolve().parents[1]
MODELS = runpy.run_path(str(ROOT / "shared/parsing-models.py"))
OP = runpy.run_path(str(ROOT / "shared/precedence-model.py"))


class Tables(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tables = {}
        self.caption = None
        self.rows = None
        self.current_row = None
        self.buffer = None
        self.tag = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.rows = []
        elif tag == "tr":
            self.current_row = []
        elif tag in {"caption", "td", "th"}:
            self.tag = tag
            self.buffer = []

    def handle_data(self, data):
        if self.buffer is not None:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if tag in {"caption", "td", "th"} and self.buffer is not None:
            value = " ".join("".join(self.buffer).split())
            if tag == "caption":
                self.caption = value
            else:
                self.current_row.append(value)
            self.buffer = None
        elif tag == "tr":
            self.rows.append(self.current_row)
        elif tag == "table":
            assert self.caption not in self.tables, self.caption
            self.tables[self.caption] = self.rows


def published(topic):
    path = ROOT / "topics/syntax-analysis" / topic / "body.en.html"
    return Tables(path.read_text(encoding="utf-8")).tables


def words(alphabet, maximum):
    for length in range(maximum + 1):
        yield from product(alphabet, repeat=length)


def expression_oracle(tokens):
    """Independent operand/operator alternation and parenthesis-balance recogniser."""
    operand, depth = True, 0
    for token in tokens:
        if operand:
            if token == "id":
                operand = False
            elif token == "(":
                depth += 1
            else:
                return False
        elif token in {"+", "*"}:
            operand = True
        elif token == ")" and depth:
            depth -= 1
        else:
            return False
    return not operand and depth == 0


def html_ll_parse(rows, tokens):
    columns = rows[0][1:]
    lookup = {(row[0], terminal): value for row in rows[1:]
              for terminal, value in zip(columns, row[1:])}
    names = {row[0] for row in rows[1:]}
    stream, stack, index = list(tokens) + ["$"], ["$", "E"], 0
    for _ in range(200):
        if not stack:
            return index == len(stream)
        symbol = stack.pop()
        if symbol not in names:
            if symbol != stream[index]:
                return False
            index += 1
        else:
            rule = lookup.get((symbol, stream[index]), "error")
            if rule == "error":
                return False
            left, rhs = rule.split(" → ")
            assert left == symbol and "/" not in rhs
            if rhs != "ε":
                stack.extend(reversed(rhs.split()))
    raise AssertionError("non-progressing published LL table")


def html_lr_parse(rows, rules, tokens):
    lookup = {int(row[0]): dict(zip(rows[0][1:], row[1:])) for row in rows[1:]}
    stack, stream, index = [0], list(tokens) + ["$"], 0
    for _ in range(200):
        action = lookup[stack[-1]].get(stream[index], "error")
        if action == "error":
            return False
        if action == "acc":
            return index == len(tokens)
        assert "/" not in action
        number = int(action[1:])
        if action[0] == "s":
            stack.append(number)
            index += 1
        else:
            assert action[0] == "r"
            left, rhs = rules[number]
            if rhs:
                del stack[-len(rhs):]
            stack.append(int(lookup[stack[-1]][left]))
    raise AssertionError("non-progressing published LR table")


def check_sets():
    expected = {
        "E": ({"(", "id"}, {"$", ")"}),
        "R": ({"+", "ε"}, {"$", ")"}),
        "T": ({"(", "id"}, {"$", ")", "+"}),
        "Q": ({"*", "ε"}, {"$", ")", "+"}),
        "F": ({"(", "id"}, {"$", ")", "+", "*"}),
    }
    first, follow = MODELS["first_follow"](MODELS["EXPRESSION"], "E")
    rows = published("cd-first-follow")["Complete expression FIRST/FOLLOW sets"]
    for name, first_text, follow_text in rows[1:]:
        decode = lambda text: set(text.strip("{}").split(", "))
        assert (decode(first_text), decode(follow_text)) == expected[name]
        assert (first[name], follow[name]) == expected[name]
    nullable = {"S": [("A", "B", "A")], "A": [("a",), ()], "B": [("b",), ()]}
    first, follow = MODELS["first_follow"](nullable, "S")
    assert first == {"S": {"a", "b", "ε"}, "A": {"a", "ε"}, "B": {"b", "ε"}}
    assert follow == {"S": {"$"}, "A": {"a", "b", "$"}, "B": {"a", "$"}}
    cyclic = {"S": [("A",)], "A": [("B",), ("x",)], "B": [("A",), ()]}
    first, follow = MODELS["first_follow"](cyclic, "S")
    assert all(value == {"x", "ε"} for value in first.values())
    assert all(value == {"$"} for value in follow.values())
    print("FIRST/FOLLOW: published expression sets, nullable occurrences, and cyclic fixed points pass")


def check_expressions():
    rows = published("cd-ll1-parsing")["Complete LL(1) expression table"]
    op_rows = published("cd-operator-precedence")
    op_rows = op_rows["Every terminal precedence relation; blank relations are errors"]
    _, _, relation = OP["relations"](OP["GRAMMAR"], "E")
    for row in op_rows[1:]:
        for right, value in zip(op_rows[0][1:], row[1:]):
            if row[0] == right == "$":
                assert value == "accept test"
            else:
                expected = "/".join(sorted(relation.get((row[0], right), set()))) or "error"
                assert value == expected
    count = 0
    for tokens in words(("id", "+", "*", "(", ")"), 6):
        expected = expression_oracle(tokens)
        actual, _ = MODELS["predictive_parse"](MODELS["EXPRESSION"], "E", tokens)
        assert actual == expected, ("LL model", tokens)
        assert html_ll_parse(rows, tokens) == expected, ("LL table", tokens)
        assert OP["precedence_parse"](tokens)[0] == expected, ("precedence", tokens)
        count += 1
    print(f"Expressions: {count} token streams agree with an independent syntax oracle")
    print("Published LL(1) and precedence relation cells: pass")


def check_lr():
    grammar = {"S": [("C", "C")], "C": [("c", "C"), ("d",)]}
    rules = [("S'", ("S",)), ("S", ("C", "C")), ("C", ("c", "C")), ("C", ("d",))]
    tables = published("cd-clr-lalr")
    clr = tables["CLR(1) for S → C C; C → c C | d: every ACTION and GOTO cell"]
    lalr = tables["LALR(1) after equal-core merging: every ACTION and GOTO cell"]
    assert len(clr) - 1 == 10 and len(lalr) - 1 == 7
    count = 0
    for tokens in words(("c", "d"), 9):
        expected = tokens.count("d") == 2 and tokens[-1:] == ("d",)
        for mode in ("lr0", "slr", "clr", "lalr"):
            assert MODELS["lr_parse"](grammar, "S", tokens, mode)[0] == expected, (mode, tokens)
        assert html_lr_parse(clr, rules, tokens) == expected, tokens
        assert html_lr_parse(lalr, rules, tokens) == expected, tokens
        count += 1
    print(f"LR families: {count} streams checked in LR(0), SLR, CLR, LALR and both published tables")
    tiny = {"S": [("A", "a"), ("b",)], "A": [("b",)]}
    tiny_rules = [("S'", ("S",)), ("S", ("A", "a")), ("S", ("b",)), ("A", ("b",))]
    rows = published("cd-lr0-slr")
    rows = rows["SLR for S → A a | b, A → b: every ACTION and GOTO cell"]
    for tokens in words(("a", "b"), 6):
        expected = tokens in (("b",), ("b", "a"))
        assert html_lr_parse(rows, tiny_rules, tokens) == expected
        assert MODELS["lr_parse"](tiny, "S", tokens)[0] == expected
    assert any(len(v) > 1 for v in MODELS["lr_table"](tiny, "S", "lr0")[3].values())
    assert all(len(v) == 1 for v in MODELS["lr_table"](tiny, "S", "slr")[3].values())
    expression = {"E": [("E", "+", "T"), ("T",)],
                  "T": [("T", "*", "F"), ("F",)], "F": [("id",)]}
    expression_rules = [("E'", ("E",)), ("E", ("E", "+", "T")), ("E", ("T",)),
                        ("T", ("T", "*", "F")), ("T", ("F",)), ("F", ("id",))]
    expression_tables = published("cd-lr0-slr")
    caption = next(name for name in expression_tables
                   if name.startswith("Second SLR construction") and "ACTION" in name)
    expression_rows = expression_tables[caption]
    expression_count = 0
    for tokens in words(("id", "+", "*"), 7):
        assert html_lr_parse(expression_rows, expression_rules, tokens) == expression_oracle(tokens)
        expression_count += 1
    zero_actions = MODELS["lr_table"](expression, "E", "lr0")[3]
    assert any(t == "*" and len(v) > 1 for (s, t), v in zero_actions.items())
    assert all(len(v) == 1 for v in MODELS["lr_table"](expression, "E", "slr")[3].values())
    print(f"Published two-level SLR expression table: {expression_count} streams pass")
    counter = {"S": [("a", "A", "d"), ("b", "A", "e"),
                     ("a", "B", "e"), ("b", "B", "d")],
               "A": [("c",)], "B": [("c",)]}
    canonical = MODELS["lr_table"](counter, "S", "clr")
    merged = MODELS["lr_table"](counter, "S", "lalr")
    assert all(len(v) == 1 for v in canonical[3].values())
    collisions = {(s, t): values for (s, t), values in merged[3].items() if len(values) > 1}
    assert {t for _, t in collisions} == {"d", "e"}
    assert all(v == {("r", 5), ("r", 6)} for v in collisions.values())
    language = {("a", "c", "d"), ("b", "c", "e"),
                ("a", "c", "e"), ("b", "c", "d")}
    for tokens in words(("a", "b", "c", "d", "e"), 4):
        assert MODELS["lr_parse"](counter, "S", tokens, "clr")[0] == (tokens in language)
    for mode in ("lr0", "slr", "clr", "lalr"):
        empty = {"S": [("A",)], "A": [()]}
        assert MODELS["lr_parse"](empty, "S", [], mode)[0]
    nullable = {"S": [("A", "B")], "A": [("a",)], "B": [("b",), ()]}
    for tokens in words(("a", "b"), 4):
        assert MODELS["lr_parse"](nullable, "S", tokens, "clr")[0] == (
            tokens in (("a",), ("a", "b")))
    print("SLR context separation, CLR/LALR counterexample, and epsilon reductions: pass")


def check_recursive_descent():
    rng = random.Random(4312)

    def expression(depth):
        if depth == 0 or rng.randrange(4) == 0:
            number = rng.randrange(10)
            return str(number), number
        left, a = expression(depth - 1)
        right, b = expression(depth - 1)
        operator = rng.choice(("+", "-", "*"))
        value = {"+": lambda: a + b, "-": lambda: a - b, "*": lambda: a * b}[operator]()
        return f"({left}{operator}{right})", value

    count = 0
    for _ in range(500):
        text, expected = expression(4)
        parser = MODELS["Parser"](text)
        assert parser.expression() == expected, text
        parser.take("EOF")
        count += 1
    for a, b, c in product(range(5), repeat=3):
        for first, second in product(("+", "-", "*"), repeat=2):
            operate = lambda x, op, y: x + y if op == "+" else x - y if op == "-" else x * y
            if second == "*" and first != "*":
                expected = operate(a, first, b * c)
            else:
                expected = operate(operate(a, first, b), second, c)
            text = f"{a}{first}{b}{second}{c}"
            parser = MODELS["Parser"](text)
            assert parser.expression() == expected, text
            parser.take("EOF")
            count += 1
    for text in ("", "-2", "2/3", "1;", "1 2", "(", ")", "(2", "2)",
                 "3**2", "3+-2", "²", "١", "2.5"):
        try:
            parser = MODELS["Parser"](text)
            parser.expression()
            parser.take("EOF")
        except MODELS["ParseError"]:
            pass
        else:
            raise AssertionError(("accepted malformed expression", text))
    values, errors = MODELS["Parser"]("8+; 6*7; (2+3; 5;").program()
    assert values == [42, 5] and len(errors) == 2
    assert MODELS["Parser"]("").program() == ([], [])
    values, errors = MODELS["Parser"]("7").program()
    assert values == [] and len(errors) == 1
    print(f"Recursive descent: {count} independent numeric cases, 14 malformed cases, and recovery pass")


def check_standalone_sources():
    topics = ROOT / "topics/syntax-analysis"
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    assert tuple(map(int, manifest["packageVersion"].split("."))) >= (0, 2, 0)
    assert len(next(m["topics"] for m in manifest["modules"] if m["id"] == "syntax-analysis")) == 10
    count = 0
    for path in topics.rglob("*.py"):
        compile(path.read_text(encoding="utf-8"), str(path), "exec")
        count += 1
    print(f"Standalone Python source syntax: {count} files pass")


if __name__ == "__main__":
    check_sets()
    check_expressions()
    check_lr()
    check_recursive_descent()
    check_standalone_sources()
    print("All syntax-analysis model checks passed.")
