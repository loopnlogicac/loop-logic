import numpy as np


def main():
    count = int(input())
    rows = [[int(x) for x in input().split()] for _ in range(count)]
    averages = np.array(rows, dtype=np.float64).mean(axis=0)
    print(" ".join(f"{x:.2f}" for x in averages))


if __name__ == "__main__":
    main()
