from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    with TemporaryDirectory() as directory:
        path = Path(directory) / "blank.txt"
        path.write_text("A\n\n", encoding="utf-8")
        with path.open(encoding="utf-8") as stream:
            print(repr(stream.readline()))
            print(repr(stream.readline()))
            print(repr(stream.readline()))


if __name__ == "__main__":
    main()
