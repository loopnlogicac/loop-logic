import pandas as pd

frame = pd.read_csv("fruits.csv")
means = frame.groupby("label", sort=True)["weight_g"].mean()
for label, mean in means.items():
    print(f"{label} mean weight: {mean:.1f} g")
ordered = frame.sort_values(["weight_g", "size_cm", "sweetness", "colour_score", "label"])
lightest = ordered.iloc[0]
print(f"Lightest: {lightest['label']}, {lightest['weight_g']:.1f} g")
