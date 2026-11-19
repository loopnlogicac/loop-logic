import numpy as np


def main():
    marks = np.array([[50, 60, 70], [80, 90, 100]], dtype=np.float64)
    print(marks.shape)
    print(marks[:, 1].tolist())
    print([f"{value:.2f}" for value in marks.mean(axis=1)])


if __name__ == "__main__":
    main()
