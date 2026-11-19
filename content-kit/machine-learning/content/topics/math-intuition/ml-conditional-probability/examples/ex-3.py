import pandas as pd

data = pd.read_csv("sms.csv")
clue = data["text"].str.lower().str.contains("offer", regex=False)
spam = data["label"].eq("spam")
total_clue = int(clue.sum())
print(f"messages={len(data)} clue={total_clue}")
print(f"spam with clue={int((spam & clue).sum())}")
if total_clue:
    print(f"P(spam given clue)={(spam & clue).sum()/total_clue:.3f}")
else:
    print("No clue messages; this conditional fraction is undefined.")
