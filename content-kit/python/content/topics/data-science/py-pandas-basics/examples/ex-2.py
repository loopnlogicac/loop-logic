import pandas as pd


def main():
    frame = pd.DataFrame({"roll": [11, 12, 13], "mark": [39, 40, 80]})
    passed = frame.loc[frame["mark"] >= 40, ["roll", "mark"]]
    for roll, mark in passed.itertuples(index=False, name=None):
        print(roll, mark)
    print("first", int(frame.iloc[0]["roll"]))


if __name__ == "__main__":
    main()
