import pandas as pd

column = input().strip()
frame = pd.read_csv("study.csv")
values = frame[column]
print(f"rows={len(values)}")
print(f"present={values.count()}")
print(f"missing={values.isna().sum()}")
