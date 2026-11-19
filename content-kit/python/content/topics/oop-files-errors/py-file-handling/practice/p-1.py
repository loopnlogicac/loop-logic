from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    text = input()
    with TemporaryDirectory() as directory:
        path = Path(directory) / "numbers.txt"
        path.write_text(text, encoding="utf-8")
        with path.open(encoding="utf-8") as stream:
            print(sum(map(int, stream.read().split())))


if __name__ == "__main__":
    main()
