import numpy as np


def main():
    marks = np.array([39, 40, 75, 0])
    mask = marks >= 40
    print(mask.tolist())
    print(marks[mask].tolist())


if __name__ == "__main__":
    main()
