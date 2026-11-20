import math

def main():
    try:
        score_text, label_text = input().split()
        score, label = float(score_text), int(label_text)
        if not (-1000 <= score <= 1000 and label in (0, 1)):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    loss = max(score, 0) - label * score + math.log1p(math.exp(-abs(score)))
    print(f"{loss:.3f}")


if __name__ == "__main__":
    main()
