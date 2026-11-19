import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.model_selection import train_test_split
rent = pd.read_csv("rent.csv")
train, held_out = train_test_split(rent, test_size=0.2, random_state=0)
print(f"Training rows: {len(train)}; untouched rows: {len(held_out)}")
print(f"Missing feature cells: {train.drop(columns='rent_bdt').isna().sum().sum()}")
print(f"Area/rent correlation: {train[['area_sqft', 'rent_bdt']].corr().iloc[0, 1]:.3f}")
print(f"Largest training rent: {train['rent_bdt'].max():.0f}")
fig, axes = plt.subplots(1, 3, figsize=(12, 3))
axes[0].hist(train["rent_bdt"], bins=12)
axes[0].set(xlabel="Monthly rent (BDT)", ylabel="Homes")
axes[1].boxplot(train["rent_bdt"].dropna())
axes[1].set(ylabel="Monthly rent (BDT)", xticks=[1], xticklabels=["Training"])
axes[2].scatter(train["area_sqft"], train["rent_bdt"], s=10)
axes[2].set(xlabel="Area (sq ft)", ylabel="Monthly rent (BDT)")
fig.tight_layout()
fig.savefig("rent-eda.png")
plt.close(fig)
print("Saved rent-eda.png: training rent distribution, box plot and area/rent scatter.")
