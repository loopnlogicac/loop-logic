words = input().split()
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
for word in words:
    if counts[word] == 1:
        print(word)
        break
else:
    print("NONE")
