import numpy as np


def main():
    values = np.array([10, 20, 30, 40])
    window = values[1:3]
    separate = values[1:3].copy()
    window[0] = 99
    separate[1] = 77
    print(values.tolist())
    print(separate.tolist())


if __name__ == "__main__":
    main()
