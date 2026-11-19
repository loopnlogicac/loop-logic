from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    with TemporaryDirectory() as directory:
        path = Path(directory) / "marks.txt"
        with path.open("w", encoding="utf-8") as stream:
            stream.write("75\n")
        with path.open("a", encoding="utf-8") as stream:
            stream.write("80\n")
        with path.open(encoding="utf-8") as stream:
            for number, line in enumerate(stream, 1):
                print(number, int(line))


if __name__ == "__main__":
    main()
