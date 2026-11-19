from statistics import median
tokens = input().split()
observed = [float(v) for v in tokens if v != "?"]
if not observed:
    print("UNDEFINED")
else:
    fill = median(observed)
    print(" ".join(f"{fill if v == '?' else float(v):.1f}" for v in tokens))
