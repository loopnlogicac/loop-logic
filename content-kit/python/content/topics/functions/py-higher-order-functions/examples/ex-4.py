records = [(12, 80), (18, 90), (25, 80)]
ranked = sorted(records, key=lambda record: -record[1])
words = ["lab", "a", "notes", "to"]
print(ranked)
print(sorted(words, key=len))
print(records)
