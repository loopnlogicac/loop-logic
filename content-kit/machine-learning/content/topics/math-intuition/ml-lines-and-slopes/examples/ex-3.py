import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

data = pd.read_csv("study.csv").dropna(subset=["hours_studied", "marks"])
X, y = data[["hours_studied"]], data["marks"]
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
model = LinearRegression().fit(X_train, y_train)
predicted = model.predict(X_test)
print(f"slope={model.coef_[0]:.3f} intercept={model.intercept_:.3f}")
print(f"test mean absolute error={mean_absolute_error(y_test, predicted):.3f}")
