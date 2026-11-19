import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.model_selection import train_test_split

frame = pd.read_csv("rent.csv")
development, _ = train_test_split(frame, test_size=0.2, random_state=0)
fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.scatter(development["area_sqft"], development["rent_bdt"], alpha=0.65, s=18)
ax.set_xlabel("Area (square feet)")
ax.set_ylabel("Monthly rent (BDT, log scale)")
ax.set_yscale("log")
ax.set_title("Invented rent: development rows only")
fig.savefig("rent-development.png", dpi=120)
plt.close(fig)
print(f"Development rows inspected: {len(development)}")
print("The picture compares area and rent; the log rent axis keeps the extreme value visible.")
for district, values in development.groupby("district")["rent_bdt"]:
    print(f"{district}: median {values.median():.0f} BDT/month")
