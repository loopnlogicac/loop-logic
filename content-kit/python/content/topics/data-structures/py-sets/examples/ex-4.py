first = frozenset([12, 18])
same_team = frozenset([18, 12])
teams = {first, same_team, frozenset([25])}
print(first == same_team)
print(len(teams))
print(sorted(first | frozenset([25])))
