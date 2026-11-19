import numpy as np


def main():
    count = int(input())
    marks = np.array([[int(x) for x in input().split()] for _ in range(count)])
    centered = marks - marks.mean(axis=1, keepdims=True)
    for row in centered:
        print(" ".join(f"{0.0 if abs(x) < 0.005 else x:.2f}" for x in row))


if __name__ == "__main__":
    main()
