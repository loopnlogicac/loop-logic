counts = {}
for word in input().split():
    counts[word] = counts.get(word, 0) + 1
if not counts:
    print("EMPTY")
else:
    best = ""
    largest = 0
    for word in sorted(counts):
        if counts[word] > largest:
            best = word
            largest = counts[word]
    print(best, largest)
