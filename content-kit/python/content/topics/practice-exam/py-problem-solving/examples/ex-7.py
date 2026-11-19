import sys


def main():
    n = int(sys.stdin.buffer.read())
    divisor = 2
    while divisor * divisor <= n and n % divisor != 0:
        divisor += 1
    print("PRIME" if n >= 2 and divisor * divisor > n else "NOT PRIME")


if __name__ == "__main__":
    main()
