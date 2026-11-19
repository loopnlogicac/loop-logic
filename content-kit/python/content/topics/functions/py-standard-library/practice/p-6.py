from collections import defaultdict
from pathlib import PurePosixPath


def main():
    groups = defaultdict(list)
    for file_number in range(int(input())):
        name = input()
        suffix = PurePosixPath(name).suffix or "NO_SUFFIX"
        groups[suffix].append(name)
    for suffix in sorted(groups):
        print(suffix, *sorted(groups[suffix]))


if __name__ == "__main__":
    main()
