import re


if __name__ == "__main__":
    short_first = re.compile(r"=|==")
    long_first = re.compile(r"==|=")
    print(f"short first: {short_first.match('==').group()}")
    print(f"long first: {long_first.match('==').group()}")
