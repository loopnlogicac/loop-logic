import sys

import pandas as pd


def main():
    frame = pd.read_csv(sys.stdin, dtype={"roll": "string", "mark": "int64"})
    rolls = frame.loc[frame["mark"] >= 40, "roll"].tolist()
    print("\n".join(rolls) if rolls else "NONE")


if __name__ == "__main__":
    main()
