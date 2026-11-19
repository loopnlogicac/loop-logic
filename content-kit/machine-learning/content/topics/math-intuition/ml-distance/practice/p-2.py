q = list(map(float, input().split()))
values = list(map(float, input().split()))
distances = [(values[2*i]-q[0])**2 + (values[2*i+1]-q[1])**2 for i in range(3)]
print(min(range(3), key=lambda i: (distances[i], i)) + 1)
