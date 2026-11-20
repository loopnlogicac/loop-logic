def main():
    try:
        p, threshold = map(float, input().split())
        if not (0 <= p <= 1 and 0 <= threshold <= 1):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    print(int(p >= threshold))


if __name__ == "__main__":
    main()
