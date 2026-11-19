import pandas as pd

frame = pd.read_csv("study.csv")
for column in frame.columns:
    print(f"{column}: missing={int(frame[column].isna().sum())}")
print(f"Present study hours: {int(frame['hours_studied'].count())}")
print(f"Largest study time: {frame['hours_studied'].max():.1f} hours/day")
