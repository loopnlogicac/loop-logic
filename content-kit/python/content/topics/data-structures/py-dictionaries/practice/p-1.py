counts = {}
for word in input().split():
    counts[word] = counts.get(word, 0) + 1
for word in sorted(counts):
    print(word, counts[word])
