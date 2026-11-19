records = []
for record_number in range(int(input())):
    roll, mark = map(int, input().split())
    records.append((roll, mark))
ranked = sorted(records, key=lambda record: (-record[1], record[0]))
for roll, mark in ranked:
    print(roll, mark)
