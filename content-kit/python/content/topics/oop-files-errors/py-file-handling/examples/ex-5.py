from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    with TemporaryDirectory() as directory:
        path = Path(directory) / "saved.txt"
        path.write_text("keep", encoding="utf-8")
        try:
            with path.open("x", encoding="utf-8") as stream:
                stream.write("replace")
        except FileExistsError:
            print("already exists")
        print(path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    main()
