marks = {}
for record_number in range(int(input())):
    roll, mark = [int(token) for token in input().split()]
    marks[roll] = mark
for roll in sorted(marks):
    print(roll, marks[roll])
