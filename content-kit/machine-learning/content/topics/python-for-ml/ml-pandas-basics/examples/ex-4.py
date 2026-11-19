import pandas as pd

frame = pd.DataFrame({"size_cm": [2, 3, 4, 6, 7],
                      "sweetness": [3, 2, 3, 7, 8]})
mask = (frame["size_cm"] >= 4) & (frame["sweetness"] >= 7)
chosen = frame.loc[mask].copy()
chosen["size_mm"] = chosen["size_cm"] * 10
print(chosen.to_string(index=False))
print(f"Original columns: {frame.columns.tolist()}")
