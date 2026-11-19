from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    lines = [input() for _ in range(int(input()))]
    with TemporaryDirectory() as directory:
        path = Path(directory) / "lines.txt"
        with path.open("w", encoding="utf-8") as stream:
            for line in lines:
                stream.write(line + "\n")
        with path.open(encoding="utf-8") as stream:
            print(sum(line == "\n" for line in stream))


if __name__ == "__main__":
    main()
