original = {"lab": [12, 18]}
copied = original.copy()
copied["lab"].append(25)
copied["new"] = []
print(original)
print(sorted(copied))
