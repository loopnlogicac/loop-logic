import numpy as np


def main():
    marks = np.array([[40, 50, 60], [70, 80, 90]])
    bonus = np.array([1, 2, 3])
    print((marks + bonus).tolist())
    try:
        marks + np.array([1, 2])
    except ValueError:
        print("incompatible shapes")


if __name__ == "__main__":
    main()
