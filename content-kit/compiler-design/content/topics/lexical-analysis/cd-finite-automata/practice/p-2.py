import sys


def main():
    transitions = {
        0: {"a": 1, "b": 0},
        1: {"a": 1, "b": 2},
        2: {"a": 1, "b": 0},
    }
    for text in sys.stdin.read().splitlines():
        state = 0
        for char in text:
            if char not in {"a", "b"}:
                state = -1
                break
            state = transitions[state][char]
        print("YES" if state == 2 else "NO")


if __name__ == "__main__":
    main()
