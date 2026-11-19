import os
from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    relative = Path("reports") / "marks.csv"
    print(relative.as_posix(), relative.stem, relative.suffix)
    with TemporaryDirectory() as folder:
        path = Path(folder) / "notes.txt"
        with path.open("w", encoding="utf-8") as stream:
            stream.write("lab\n")
        print(path.is_file())
        print(sorted(os.listdir(folder)))
        print(path.read_text(encoding="utf-8").strip())


if __name__ == "__main__":
    main()
