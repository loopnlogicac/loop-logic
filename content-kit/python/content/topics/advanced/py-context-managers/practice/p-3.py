from contextlib import contextmanager

@contextmanager
def setting(mapping, value):
    old = mapping["value"]
    mapping["value"] = value
    try:
        yield mapping
    finally:
        mapping["value"] = old


def main():
    old, new = map(int, input().split())
    mode = input()
    state = {"value": old}
    try:
        with setting(state, new):
            print(state["value"])
            if mode == "FAIL":
                raise ValueError("requested")
    except ValueError:
        pass
    print(state["value"])


if __name__ == "__main__":
    main()
