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




if __name__ == "__main__":
    symbols = input().split()
    if any(x not in {"A", "B", "c"} for x in symbols):
        print("invalid")
    else:
        first, _ = first_follow({"A": [("a",), ()], "B": [("b",), ()]}, "A")
        print(" ".join(sorted(first_sequence(tuple(symbols), first))))
