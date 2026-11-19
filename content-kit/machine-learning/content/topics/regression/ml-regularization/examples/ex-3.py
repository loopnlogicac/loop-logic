import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge, Lasso
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

frame = pd.read_csv("study.csv")
frame = frame.loc[frame["hours_studied"].between(0, 24) | frame["hours_studied"].isna()]
X_build, X_test, y_build, y_test = train_test_split(
    frame[["hours_studied", "attendance_pct", "past_marks", "sleep_hours"]],
    frame["marks"], test_size=0.2, random_state=0)
X_train, X_valid, y_train, y_valid = train_test_split(
    X_build, y_build, test_size=0.25, random_state=0)
choices = []
for alpha in [0.1, 1.0, 10.0, 100.0]:
    model = make_pipeline(SimpleImputer(strategy="median"), StandardScaler(), Ridge(alpha=alpha))
    model.fit(X_train, y_train)
    loss = mean_squared_error(y_valid, model.predict(X_valid))
    choices.append((loss, alpha, model))
_, alpha, model = min(choices, key=lambda item: item[0])
print(f"Selected ridge alpha: {alpha:.1f}")
print(f"Test MSE: {mean_squared_error(y_test, model.predict(X_test)):.3f}")
lasso = make_pipeline(SimpleImputer(strategy="median"), StandardScaler(),
                      Lasso(alpha=1.0, max_iter=100000, tol=1e-8, random_state=0))
lasso.fit(X_train, y_train)
print(f"Lasso zero coefficients at alpha 1: {(lasso[-1].coef_ == 0).sum()}")
