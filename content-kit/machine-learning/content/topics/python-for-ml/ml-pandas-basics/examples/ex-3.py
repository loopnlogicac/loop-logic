import pandas as pd

frame = pd.DataFrame({"size_cm": [2, 3, 4, 6, 7],
                      "sweetness": [3, 2, 3, 7, 8]},
                     index=[10, 20, 30, 40, 50])
print(f"Label 20: {frame.loc[20, 'size_cm']}")
print(f"Position 2: {frame.iloc[2, 0]}")
print(f"loc 20:40 labels: {frame.loc[20:40].index.tolist()}")
print(f"iloc 1:3 labels: {frame.iloc[1:3].index.tolist()}")
print(f"One-column table shape: {frame[['size_cm']].shape}")
