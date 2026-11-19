"""Small deterministic parsing algorithms; epsilon is the empty tuple."""

EPS = "ε"


def first_sequence(sequence, first):
    result = set()
    for symbol in sequence:
        values = first.get(symbol, {symbol})
        result.update(values - {EPS})
        if EPS not in values:
            return result
    result.add(EPS)
    return result


def first_follow(grammar, start):
    first = {name: set() for name in grammar}
    changed = True
    while changed:
        changed = False
        for name, alternatives in grammar.items():
            for rhs in alternatives:
                before = len(first[name])
                first[name].update(first_sequence(rhs, first))
                changed |= len(first[name]) != before
    follow = {name: set() for name in grammar}
    follow[start].add("$")
    changed = True
    while changed:
        changed = False
        for name, alternatives in grammar.items():
            for rhs in alternatives:
                for index, symbol in enumerate(rhs):
                    if symbol not in grammar:
                        continue
                    suffix = first_sequence(rhs[index + 1:], first)
                    before = len(follow[symbol])
                    follow[symbol].update(suffix - {EPS})
                    if EPS in suffix:
                        follow[symbol].update(follow[name])
                    changed |= len(follow[symbol]) != before
    return first, follow


def ll1_table(grammar, start):
    first, follow = first_follow(grammar, start)
    table = {}
    for name, alternatives in grammar.items():
        for rhs in alternatives:
            selection = first_sequence(rhs, first)
            terminals = selection - {EPS}
            if EPS in selection:
                terminals |= follow[name]
            for terminal in sorted(terminals):
                cell = table.setdefault((name, terminal), [])
                if rhs not in cell:
                    cell.append(rhs)
    return table


def predictive_parse(grammar, start, tokens):
    table = ll1_table(grammar, start)
    if any(len(cell) != 1 for cell in table.values()):
        raise ValueError("grammar has an LL(1) conflict")
    if "$" in tokens:
        raise ValueError("end marker belongs to the parser")
    stream = list(tokens) + ["$"]
    stack = ["$", start]
    position = 0
    trace = []
    seen = set()
    while stack:
        configuration = (tuple(stack), position)
        if configuration in seen:
            raise ValueError("non-progressing grammar")
        seen.add(configuration)
        top, lookahead = stack[-1], stream[position]
        before = (" ".join(stack), " ".join(stream[position:]))
        if top not in grammar:
            if top != lookahead:
                trace.append((*before, f"error: expected {top}"))
                return False, trace
            stack.pop()
            position += 1
            trace.append((*before, "accept" if top == "$" else f"match {top}"))
        else:
            cell = table.get((top, lookahead))
            if not cell:
                trace.append((*before, f"error: no rule for {top}, {lookahead}"))
                return False, trace
            rhs = cell[0]
            stack.pop()
            stack.extend(reversed(rhs))
            trace.append((*before, f"{top} -> {' '.join(rhs) or EPS}"))
    return True, trace


EXPRESSION = {
    "E": [("T", "R")],
    "R": [("+", "T", "R"), ()],
    "T": [("F", "Q")],
    "Q": [("*", "F", "Q"), ()],
    "F": [("(", "E", ")"), ("id",)],
}


class ParseError(Exception):
    pass


def tokenize(text):
    tokens = []
    position = 0
    while position < len(text):
        char = text[position]
        if char.isspace():
            position += 1
        elif char.isascii() and char.isdigit():
            end = position + 1
            while end < len(text) and text[end].isascii() and text[end].isdigit():
                end += 1
            tokens.append(("NUM", int(text[position:end]), position))
            position = end
        elif char in "+-*();":
            tokens.append((char, char, position))
            position += 1
        else:
            raise ParseError(f"column {position + 1}: unknown character {char!r}")
    tokens.append(("EOF", "", len(text)))
    return tokens


class Parser:
    def __init__(self, text):
        self.tokens = tokenize(text)
        self.position = 0

    def kind(self):
        return self.tokens[self.position][0]

    def take(self, kind):
        token = self.tokens[self.position]
        if token[0] != kind:
            raise ParseError(f"column {token[2] + 1}: expected {kind}, found {token[0]}")
        self.position += 1
        return token[1]

    def expression(self):
        value = self.term()
        while self.kind() in ("+", "-"):
            operator = self.kind()
            self.take(operator)
            right = self.term()
            value = value + right if operator == "+" else value - right
        return value

    def term(self):
        value = self.factor()
        while self.kind() == "*":
            self.take("*")
            value *= self.factor()
        return value

    def factor(self):
        if self.kind() == "NUM":
            return self.take("NUM")
        self.take("(")
        value = self.expression()
        self.take(")")
        return value

    def program(self):
        results, errors = [], []
        while self.kind() != "EOF":
            try:
                value = self.expression()
                self.take(";")
                results.append(value)
            except ParseError as error:
                errors.append(str(error))
                while self.kind() not in (";", "EOF"):
                    self.position += 1
                if self.kind() == ";":
                    self.position += 1
        return results, errors


def lr_collection(grammar, start, lookaheads=False):
    augmented = start + "'"
    while augmented in grammar:
        augmented += "'"
    rules = [(augmented, (start,))]
    rules += [(name, rhs) for name, alternatives in grammar.items() for rhs in alternatives]
    extended = {augmented: [(start,)], **grammar}
    first, _ = first_follow(extended, augmented)

    def closure(seed):
        items = set(seed)
        changed = True
        while changed:
            changed = False
            for number, dot, lookahead in sorted(items):
                _, rhs = rules[number]
                if dot == len(rhs) or rhs[dot] not in extended:
                    continue
                leads = first_sequence(rhs[dot + 1:] + (lookahead,), first)
                if not lookaheads:
                    leads = {""}
                for child, (name, _) in enumerate(rules):
                    if name == rhs[dot]:
                        for terminal in sorted(leads):
                            item = (child, 0, terminal)
                            if item not in items:
                                items.add(item)
                                changed = True
        return frozenset(items)

    states = [closure({(0, 0, "$" if lookaheads else "")})]
    transitions = {}
    index = 0
    while index < len(states):
        symbols = sorted({rules[p][1][d] for p, d, _ in states[index]
                          if d < len(rules[p][1])})
        for symbol in symbols:
            moved = {(p, d + 1, a) for p, d, a in states[index]
                     if d < len(rules[p][1]) and rules[p][1][d] == symbol}
            target = closure(moved)
            if target not in states:
                states.append(target)
            transitions[index, symbol] = states.index(target)
        index += 1
    return rules, states, transitions


def merge_lalr(states, transitions):
    groups = {}
    mapping = {}
    merged = []
    for old, items in enumerate(states):
        core = frozenset((p, d) for p, d, _ in items)
        if core not in groups:
            groups[core] = len(merged)
            merged.append(set())
        new = groups[core]
        mapping[old] = new
        merged[new].update(items)
    edges = {}
    for (old, symbol), target in transitions.items():
        key, value = (mapping[old], symbol), mapping[target]
        if key in edges and edges[key] != value:
            raise ValueError("inconsistent merged transition")
        edges[key] = value
    return list(map(frozenset, merged)), edges, mapping


def lr_table(grammar, start, mode="slr"):
    if mode not in {"lr0", "slr", "clr", "lalr"}:
        raise ValueError("unknown LR mode")
    rules, states, edges = lr_collection(grammar, start, mode in {"clr", "lalr"})
    if mode == "lalr":
        states, edges, _ = merge_lalr(states, edges)
    terminals = {x for _, rhs in rules for x in rhs if x not in grammar} | {"$"}
    _, follow = first_follow(grammar, start)
    action, goto = {}, {}

    def add(state, terminal, value):
        action.setdefault((state, terminal), set()).add(value)

    for (state, symbol), target in edges.items():
        if symbol in grammar:
            goto[state, symbol] = target
        else:
            add(state, symbol, ("s", target))
    for state, items in enumerate(states):
        for number, dot, lookahead in sorted(items):
            name, rhs = rules[number]
            if dot != len(rhs):
                continue
            if number == 0:
                add(state, "$", ("acc", 0))
                continue
            leads = terminals if mode == "lr0" else follow[name]
            if mode in {"clr", "lalr"}:
                leads = {lookahead}
            for terminal in leads:
                add(state, terminal, ("r", number))
    return rules, states, edges, action, goto


def lr_parse(grammar, start, tokens, mode="slr"):
    rules, _, _, action, goto = lr_table(grammar, start, mode)
    if any(len(cell) != 1 for cell in action.values()):
        raise ValueError("LR table has conflicts")
    if "$" in tokens:
        raise ValueError("end marker belongs to the parser")
    stream, stack, position, trace = list(tokens) + ["$"], [0], 0, []
    while True:
        cell = action.get((stack[-1], stream[position]), set())
        before = (" ".join(map(str, stack)), " ".join(stream[position:]))
        if not cell:
            trace.append((*before, "error"))
            return False, trace
        kind, number = next(iter(cell))
        trace.append((*before, "accept" if kind == "acc" else f"{kind}{number}"))
        if kind == "acc":
            return True, trace
        if kind == "s":
            stack.append(number)
            position += 1
        else:
            name, rhs = rules[number]
            if rhs:
                del stack[-len(rhs):]
            stack.append(goto[stack[-1], name])


def item_text(rules, item, lookaheads=False):
    number, dot, lookahead = item
    name, rhs = rules[number]
    symbols = list(rhs)
    symbols.insert(dot, "·")
    result = f"{name} -> {' '.join(symbols)}"
    return f"{result}, {lookahead}" if lookaheads else result


def show_lr(grammar, start, mode):
    rules, states, edges, action, goto = lr_table(grammar, start, mode)
    for index, items in enumerate(states):
        print(f"I{index}")
        for item in sorted(items):
            print(" ", item_text(rules, item, mode in {"clr", "lalr"}))
    for (state, symbol), target in sorted(edges.items()):
        print(f"GOTO(I{state}, {symbol}) = I{target}")
    for (state, terminal), cell in sorted(action.items()):
        values = "/".join(k if k == "acc" else f"{k}{n}" for k, n in sorted(cell))
        print(f"ACTION[{state}, {terminal}] = {values}")
    for (state, name), target in sorted(goto.items()):
        print(f"GOTO[{state}, {name}] = {target}")


if __name__ == "__main__":
    first, follow = first_follow(EXPRESSION, "E")
    for symbol in EXPRESSION:
        print(symbol, "FIRST", " ".join(sorted(first[symbol])),
              "FOLLOW", " ".join(sorted(follow[symbol])))
