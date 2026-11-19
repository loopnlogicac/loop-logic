words = "pen book pen ruler book pen".split()
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
for word in sorted(counts):
    print(f"{word}: {counts[word]}")
