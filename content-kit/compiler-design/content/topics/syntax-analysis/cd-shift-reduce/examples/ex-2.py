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
    grammar = {"E": [("E", "+", "E"), ("id",)]}
    _, _, _, action, _ = lr_table(grammar, "E")
    for (state, terminal), cell in sorted(action.items()):
        if len(cell) > 1:
            print(state, terminal, "/".join(f"{k}{n}" for k, n in sorted(cell)))
