


def main():
    for text in ["75", "seventy"]:
        try:
            value = int(text)
        except ValueError:
            print("invalid")
        else:
            print(f"mark {value}")
        finally:
            print("attempt finished")


if __name__ == "__main__":
    main()
