import numpy as np


def main():
    marks = [20, 35, 40]
    values = np.array(marks, dtype=np.int64)
    print(marks * 2)
    print((values * 2).tolist())
    print(values.shape, values.ndim)


if __name__ == "__main__":
    main()
