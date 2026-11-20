def main():
    try:
        x, y = map(float, input().split())
        if not (0 <= x <= 6 and 0 <= y <= 6):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    if x <= 3:
        prediction = 0 if y <= 4.5 else 1
    else:
        prediction = 1
    print(prediction)


if __name__ == "__main__":
    main()
