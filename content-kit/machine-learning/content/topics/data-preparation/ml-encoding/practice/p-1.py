for token in input().split():
    print(" ".join(str(int(token == c)) for c in ["B", "M", "U"]))
