import numpy as np


def mean_size(sizes):
    return float(np.mean(sizes))


def main():
    sizes = [2, 3, 4, 5, 6]
    print(f"Cards: {len(sizes)}")
    print(f"Mean size: {mean_size(sizes):.1f} cm")


if __name__ == "__main__":
    main()
