scores = tuple(int(token) for token in input().split())
first, *middle, last = scores
print(first, last)
print(sum(middle))
