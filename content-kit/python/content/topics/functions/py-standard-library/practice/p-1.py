import math


def main():
    number = int(input())
    root = math.isqrt(number)
    print(root, "YES" if root * root == number else "NO")


if __name__ == "__main__":
    main()
