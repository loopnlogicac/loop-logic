import numpy as np


def main():
    marks = np.array([int(x) for x in input().split()], dtype=np.int64)
    bonus = int(input())
    adjusted = np.minimum(marks + bonus, 100)
    print(" ".join(str(int(x)) for x in adjusted))


if __name__ == "__main__":
    main()
