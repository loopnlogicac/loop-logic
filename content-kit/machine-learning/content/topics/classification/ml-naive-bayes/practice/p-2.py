def main():
    try:
        a, b = map(int, input().split())
        if not (0 <= a <= 100 and 0 <= b <= 100):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    denominator = a + b + 2
    print(f"{(a + 1) / denominator:.3f} {(b + 1) / denominator:.3f}")


if __name__ == "__main__":
    main()
