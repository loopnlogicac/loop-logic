TRANSITIONS = {"A": {"a": "A", "b": "B"}, "B": {"a": "A", "b": "B"}}


if __name__ == "__main__":
    state = "A"
    print(f"start: {state}")
    for position, char in enumerate("aab", 1):
        target = TRANSITIONS[state][char]
        print(f"{position}: {state} --{char}--> {target}")
        state = target
    print(f"accepted: {state == 'B'}")
