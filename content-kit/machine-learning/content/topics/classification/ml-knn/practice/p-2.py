def main():
    try:
        labels = list(map(int, input().split()))
        if not 1 <= len(labels) <= 9 or any(v not in (0, 1) for v in labels):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    votes = [labels.count(0), labels.count(1)]
    winner = int(votes[1] > votes[0])
    print(f"{winner} {votes[winner]}")


if __name__ == "__main__":
    main()
