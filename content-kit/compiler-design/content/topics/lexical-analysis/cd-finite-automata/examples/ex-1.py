TRANSITIONS = {
    "E": {"a": "E", "b": "O"},
    "O": {"a": "O", "b": "E"},
}


def accepts(text):
    state = "E"
    for char in text:
        if char not in TRANSITIONS[state]:
            return False
        state = TRANSITIONS[state][char]
    return state == "E"


if __name__ == "__main__":
    for text in ["", "b", "bb", "abba", "abx"]:
        print(f"{text!r}: {accepts(text)}")
