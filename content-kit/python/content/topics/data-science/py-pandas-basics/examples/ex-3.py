from pathlib import Path
from tempfile import TemporaryDirectory

import pandas as pd


def main():
    with TemporaryDirectory() as folder:
        path = Path(folder) / "marks.csv"
        path.write_text("roll,mark\n001,40\n002,75\n", encoding="utf-8")
        frame = pd.read_csv(path, dtype={"roll": "string", "mark": "int64"})
        for roll, mark in frame.itertuples(index=False, name=None):
            print(roll, mark)


if __name__ == "__main__":
    main()
