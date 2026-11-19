train = input().split()
future = input().split()
observed = [float(v) for v in train if v != "?"]
if not observed:
    print("UNDEFINED")
else:
    fill = sum(observed) / len(observed)
    print(" ".join(f"{fill if v == '?' else float(v):.2f}" for v in future))
