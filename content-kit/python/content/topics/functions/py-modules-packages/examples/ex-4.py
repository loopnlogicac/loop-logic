from pathlib import Path
import sys

# Isolated Python omits the script folder; expose this known lesson folder.
module_folder = Path(__file__).resolve().parent
sys.path.insert(0, str(module_folder))
import billing
from billing import total


def main():
    print(billing.CURRENCY)
    print(total(3, 20))


if __name__ == "__main__":
    main()
