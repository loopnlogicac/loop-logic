import pandas as pd

frame = pd.read_csv("fruits.csv")
print(f"Shape: {frame.shape}")
print(f"Numeric columns: {frame.select_dtypes(include='number').columns.tolist()}")
print(f"Missing cells: {int(frame.isna().sum().sum())}")
counts = frame["label"].value_counts().sort_index()
for label, count in counts.items():
    print(f"{label}: {count}")
