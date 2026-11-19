import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.pipeline import make_pipeline
from sklearn.tree import DecisionTreeClassifier
study = pd.read_csv("study.csv")
features = ["hours_studied", "attendance_pct", "past_marks", "sleep_hours"]
x = study[features].copy()
x.loc[~x["hours_studied"].between(0, 24), "hours_studied"] = float("nan")
x_train, x_test, y_train, y_test = train_test_split(
    x, study["passed"], test_size=0.2, stratify=study["passed"], random_state=0)
model = make_pipeline(SimpleImputer(strategy="median"),
                      DecisionTreeClassifier(max_depth=3, random_state=0))
model.fit(x_train, y_train)
print(f"Features: {', '.join(features)}")
print(f"Held-out accuracy: {model.score(x_test, y_test):.3f}")
