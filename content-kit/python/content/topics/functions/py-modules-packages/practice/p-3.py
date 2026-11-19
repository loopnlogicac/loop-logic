import statistics as stats


def main():
    values = [int(token) for token in input().split()]
    print(f"{stats.median(values):.1f}")


if __name__ == "__main__":
    main()
