from contextlib import contextmanager

@contextmanager
def temporary(mapping, key, value):
    old = mapping[key]
    mapping[key] = value
    try:
        yield mapping
    finally:
        mapping[key] = old


def main():
    settings = {"mode": "normal"}
    try:
        with temporary(settings, "mode", "exam") as active:
            print(active["mode"])
            raise ValueError("stop")
    except ValueError:
        print(settings["mode"])


if __name__ == "__main__":
    main()
