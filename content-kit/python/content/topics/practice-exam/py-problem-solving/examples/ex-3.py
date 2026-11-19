import sys


def main():
    seconds = int(sys.stdin.buffer.read())
    hours, rest = divmod(seconds, 3600)
    minutes, seconds = divmod(rest, 60)
    print(hours, minutes, seconds)


if __name__ == "__main__":
    main()
