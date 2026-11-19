import pandas as pd

frame = pd.DataFrame({"size_cm": [2, 3, 4, 6, 7],
                      "sweetness": [3, 2, 3, 7, 8]},
                     index=[10, 20, 30, 40, 50])
sizes = frame["size_cm"]
print(f"Table shape: {frame.shape}")
print(f"Column kind: {type(sizes).__name__}")
print(frame.head(2).to_string())
