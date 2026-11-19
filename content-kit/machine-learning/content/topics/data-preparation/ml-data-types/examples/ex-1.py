import pandas as pd
frame = pd.DataFrame({"area": [600.5, 800.0], "rooms": [2, 3],
                      "district": ["Mirpur", "Badda"],
                      "grade": pd.Categorical(["low", "high"],
                           categories=["low", "medium", "high"], ordered=True),
                      "listed": pd.to_datetime(["2026-01-01", "2026-01-03"])})
for name, dtype in frame.dtypes.items():
    print(f"{name}: {dtype}")
