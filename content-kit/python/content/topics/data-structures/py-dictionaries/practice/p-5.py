groups = {}
for position, token in enumerate(input().split(), 1):
    mark = int(token)
    if mark not in groups:
        groups[mark] = []
    groups[mark].append(position)
for mark in sorted(groups):
    print(mark, *groups[mark])
