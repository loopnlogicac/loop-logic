import sys


def main():
    transitions = {"E": {"a": "E", "b": "O"}, "O": {"a": "O", "b": "E"}}
    for text in sys.stdin.read().splitlines():
        state = "E"
        for char in text:
            if char not in {"a", "b"}:
                state = "DEAD"
                break
            state = transitions[state][char]
        print("ACCEPT" if state == "E" else "REJECT")


if __name__ == "__main__":
    main()
