import random


def main():
    generator = random.Random(2026)
    values = [generator.random() for draw in range(3)]
    print(" ".join(f"{value:.4f}" for value in values))
    repeat = random.Random(2026)
    print(values[0] == repeat.random())


if __name__ == "__main__":
    main()
