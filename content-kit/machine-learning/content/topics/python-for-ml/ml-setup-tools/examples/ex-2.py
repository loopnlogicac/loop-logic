import sys
from importlib.metadata import version


def main():
    print(f"Python >= 3.10: {sys.version_info >= (3, 10)}")
    minimums = {"numpy": (2, 0), "pandas": (2, 2),
                "scikit-learn": (1, 5), "matplotlib": (3, 8)}
    for package, minimum in minimums.items():
        installed = version(package)
        major_minor = tuple(int(part) for part in installed.split(".")[:2])
        print(f"{package} meets minimum: {major_minor >= minimum}")


if __name__ == "__main__":
    main()
