from datetime import date, timedelta


def main():
    start = date.fromisoformat(input())
    delay = int(input())
    print((start + timedelta(days=delay)).isoformat())


if __name__ == "__main__":
    main()
