import pandas as pd
raw = pd.Series(["12", "unknown", "4"])
values = pd.to_numeric(raw, errors="coerce")
print(f"Missing after conversion: {values.isna().sum()}")
print(f"Observed total: {values.sum():.1f}")
dates = pd.to_datetime(pd.Series(["2026-01-01", "2026-01-03"]))
print(f"Elapsed days: {(dates.iloc[1] - dates.iloc[0]).days}")
