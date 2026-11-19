import pandas as pd


def main():
    count, cutoff = map(int, input().split())
    rows = [tuple(map(int, input().split())) for _ in range(count)]
    frame = pd.DataFrame(rows, columns=["roll", "mark"])
    rolls = frame.loc[frame["mark"] >= cutoff, "roll"].sort_values()
    print(" ".join(str(int(x)) for x in rolls) if len(rolls) else "NONE")


if __name__ == "__main__":
    main()
