import sys


def main():
    print(f"Python {sys.version_info.major}")
    print(isinstance(sys.executable, str))
    print(isinstance(sys.prefix, str))
    print(isinstance(sys.base_prefix, str))


if __name__ == "__main__":
    main()
