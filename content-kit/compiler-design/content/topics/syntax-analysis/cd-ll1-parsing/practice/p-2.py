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




if __name__ == "__main__":
    mode = input().strip()
    grammars = {"choice": {"S": [("a", "A"), ("a", "B")],
                           "A": [("x",)], "B": [("y",)]},
                "nullable": {"S": [("A", "a")], "A": [("a",), ()]}}
    if mode not in grammars:
        print("invalid")
    else:
        for (name, terminal), rules in sorted(ll1_table(grammars[mode], "S").items()):
            if len(rules) > 1:
                print(name, terminal, len(rules))
