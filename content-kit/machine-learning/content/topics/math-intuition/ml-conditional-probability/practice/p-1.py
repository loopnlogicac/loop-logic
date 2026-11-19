tp, fn, fp, tn = map(float, input().split())
if tp + fp > 0:
    print(f"{tp/(tp+fp):.3f}")
else:
    print("undefined")
