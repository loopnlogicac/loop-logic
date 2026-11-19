import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
for filename in ["rent.csv", "study.csv"]:
    frame = pd.read_csv(filename)
    print(f"{filename}: {frame.isna().sum().sum()} missing cells")
    print(f"Duplicate rows: {frame.duplicated().sum()}")
study = pd.read_csv("study.csv")
x = study[["hours_studied", "attendance_pct"]].copy()
bad = ~x["hours_studied"].between(0, 24) & x["hours_studied"].notna()
print(f"Impossible study times: {bad.sum()}")
x.loc[bad, "hours_studied"] = float("nan")
train, test = train_test_split(x, test_size=0.2, random_state=0)
imputer = SimpleImputer(strategy="median").fit(train)
print(f"Held-out gaps after fill: {pd.isna(imputer.transform(test)).sum()}")
rent = pd.read_csv("rent.csv")
print(f"Rent to investigate: {rent['rent_bdt'].max():.0f} BDT")
