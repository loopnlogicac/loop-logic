import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.linear_model import SGDRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

frame = pd.read_csv("study.csv")
frame = frame.loc[frame["hours_studied"].between(0, 24) | frame["hours_studied"].isna()]
X = frame[["hours_studied", "attendance_pct", "past_marks"]]
X_train, X_test, y_train, y_test = train_test_split(
    X, frame["marks"], test_size=0.2, random_state=0)
model = make_pipeline(SimpleImputer(strategy="median"), StandardScaler(),
                      SGDRegressor(random_state=0, max_iter=10000, tol=1e-5,
                                   penalty=None, learning_rate="invscaling", eta0=0.01))
model.fit(X_train, y_train)
print(f"Test MAE: {mean_absolute_error(y_test, model.predict(X_test)):.3f} marks")
