import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline

frame = pd.read_csv("study.csv")
frame = frame.loc[frame["hours_studied"].between(0, 24) | frame["hours_studied"].isna()]
X = frame[["hours_studied", "attendance_pct", "past_marks"]]
y = frame["marks"]
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0, test_size=0.2)
model = make_pipeline(SimpleImputer(strategy="median"), LinearRegression())
model.fit(X_train, y_train)
print(f"Training rows: {len(X_train)}, test rows: {len(X_test)}")
print(f"Test MAE: {mean_absolute_error(y_test, model.predict(X_test)):.3f} marks")
