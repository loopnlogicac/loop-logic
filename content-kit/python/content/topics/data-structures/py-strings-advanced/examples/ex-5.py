text = "  Lab   notes\nlab notes  "
words = text.casefold().split()
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
print(len(words))
for word in sorted(counts):
    print(f"{word}: {counts[word]}")
