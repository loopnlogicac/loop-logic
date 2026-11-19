import pandas as pd


def main():
    first = pd.Series([50, 70], index=["quiz", "lab"])
    bonus = pd.Series([3, 2], index=["lab", "quiz"])
    total = first + bonus
    for label in ["quiz", "lab"]:
        print(label, int(total.loc[label]))


if __name__ == "__main__":
    main()
