values = list(map(int, input().split()))
for column in range(2):
    print(*(values[2*row+column] for row in range(3)))
