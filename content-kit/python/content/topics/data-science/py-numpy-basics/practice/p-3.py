import numpy as np


def main():
    marks = np.array([int(x) for x in input().split()], dtype=np.int64)
    low, high = map(int, input().split())
    print(int(np.count_nonzero((marks >= low) & (marks <= high))))


if __name__ == "__main__":
    main()
