"""FIRSTVT/LASTVT relations and a small arithmetic operator-precedence recogniser."""

GRAMMAR = {
    "E": [("E", "+", "T"), ("T",)],
    "T": [("T", "*", "F"), ("F",)],
    "F": [("(", "E", ")"), ("id",)],
}


def boundary_sets(grammar, reverse=False):
    result = {name: set() for name in grammar}
    changed = True
    while changed:
        changed = False
        for name, alternatives in grammar.items():
            for rhs in alternatives:
                symbols = rhs[::-1] if reverse else rhs
                before = len(result[name])
                if symbols[0] not in grammar:
                    result[name].add(symbols[0])
                else:
                    result[name].update(result[symbols[0]])
                    if len(symbols) > 1 and symbols[1] not in grammar:
                        result[name].add(symbols[1])
                changed |= len(result[name]) != before
    return result


def relations(grammar, start):
    first = boundary_sets(grammar)
    last = boundary_sets(grammar, True)
    result = {}

    def add(left, right, relation):
        result.setdefault((left, right), set()).add(relation)

    for alternatives in grammar.values():
        for rhs in alternatives:
            for index in range(len(rhs) - 1):
                left, right = rhs[index:index + 2]
                if left not in grammar and right not in grammar:
                    add(left, right, "=")
                if left not in grammar and right in grammar:
                    for terminal in first[right]:
                        add(left, terminal, "<")
                if left in grammar and right not in grammar:
                    for terminal in last[left]:
                        add(terminal, right, ">")
            for left, middle, right in zip(rhs, rhs[1:], rhs[2:]):
                if left not in grammar and middle in grammar and right not in grammar:
                    add(left, right, "=")
    for terminal in first[start]:
        add("$", terminal, "<")
    for terminal in last[start]:
        add(terminal, "$", ">")
    return first, last, result


def precedence_parse(tokens):
    _, _, table = relations(GRAMMAR, "E")
    terminals = {"id", "+", "*", "(", ")"}
    if any(token not in terminals for token in tokens):
        return False, [("$", " ".join(tokens), "error: unknown token")]
    stream, stack, position, trace = list(tokens) + ["$"], ["$"], 0, []
    handles = {("id",), ("N", "+", "N"), ("N", "*", "N"), ("(", "N", ")")}
    while True:
        before = (" ".join(stack), " ".join(stream[position:]))
        if stack == ["$", "N"] and stream[position] == "$":
            trace.append((*before, "accept"))
            return True, trace
        terminal_indices = [i for i, symbol in enumerate(stack) if symbol != "N"]
        top = stack[terminal_indices[-1]]
        lookahead = stream[position]
        cell = table.get((top, lookahead), set())
        if len(cell) != 1:
            trace.append((*before, "error: no unique precedence relation"))
            return False, trace
        relation = next(iter(cell))
        if relation in {"<", "="}:
            stack.append(lookahead)
            position += 1
            trace.append((*before, f"{top} {relation} {lookahead}: shift"))
            continue
        boundary = None
        for j in range(len(terminal_indices) - 1, 0, -1):
            left, right = terminal_indices[j - 1:j + 1]
            pair = table.get((stack[left], stack[right]), set())
            if pair == {"<"}:
                boundary = left
                break
            if pair != {"="}:
                break
        if boundary is None or tuple(stack[boundary + 1:]) not in handles:
            trace.append((*before, "error: invalid handle"))
            return False, trace
        handle = " ".join(stack[boundary + 1:])
        del stack[boundary + 1:]
        stack.append("N")
        trace.append((*before, f"{top} > {lookahead}: reduce {handle} to N"))


if __name__ == "__main__":
    first, last, table = relations(GRAMMAR, "E")
    for name in GRAMMAR:
        print(name, "FIRSTVT", " ".join(sorted(first[name])),
              "LASTVT", " ".join(sorted(last[name])))
    for (left, right), cell in sorted(table.items()):
        print(left, right, "/".join(sorted(cell)))
    accepted, trace = precedence_parse(["id", "+", "id", "*", "id"])
    for stack, remaining, action in trace:
        print(f"{stack} | {remaining} | {action}")
    print("accepted:", accepted)
