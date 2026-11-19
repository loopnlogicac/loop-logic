TRANSITIONS = {
    (0, "a"): {0, 1}, (0, "b"): {0}, (1, "b"): {2},
}


def accepts(text):
    states = {0}
    for char in text:
        states = set().union(*(TRANSITIONS.get((q, char), set()) for q in states))
    return 2 in states


if __name__ == "__main__":
    for text in ["ab", "aab", "aba", "b"]:
        print(f"{text}: {accepts(text)}")
