import re


def main():
    text = "CSE212 and MAT101"
    result = re.sub(r"([A-Z]{3})([0-9]{3})",
                    lambda match: f"{match.group(2)}-{match.group(1)}", text)
    print(result)
    print(text)


if __name__ == "__main__":
    main()
