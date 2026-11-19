teams = set()
for team_number in range(int(input())):
    team = frozenset(int(token) for token in input().split())
    teams.add(team)
print(len(teams))
