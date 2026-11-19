import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.tree import DecisionTreeClassifier
study = pd.read_csv("study.csv")
x = study[["hours_studied", "attendance_pct", "past_marks", "sleep_hours"]].copy()
x.loc[~x["hours_studied"].between(0, 24), "hours_studied"] = float("nan")
y = study["passed"]
x_dev, x_test, y_dev, y_test = train_test_split(
    x, y, test_size=0.2, stratify=y, random_state=0)
x_train, x_val, y_train, y_val = train_test_split(
    x_dev, y_dev, test_size=0.25, stratify=y_dev, random_state=0)
imputer = SimpleImputer(strategy="median").fit(x_train)
train, val = imputer.transform(x_train), imputer.transform(x_val)
candidates = []
for depth in [1, 3]:
    model = DecisionTreeClassifier(max_depth=depth, random_state=0).fit(train, y_train)
    candidates.append((model.score(val, y_val), -depth, model))
score, negative_depth, chosen = max(candidates, key=lambda item: item[:2])
print(f"Partition sizes: {len(y_train)}, {len(y_val)}, {len(y_test)}")
print(f"Chosen depth: {-negative_depth}")
print(f"Validation accuracy: {score:.3f}")
print(f"Final test accuracy: {chosen.score(imputer.transform(x_test), y_test):.3f}")
