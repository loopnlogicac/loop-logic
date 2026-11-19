w = list(map(int, input().split()))
values = list(map(int, input().split()))
print(*(values[2*i]*w[0]+values[2*i+1]*w[1] for i in range(3)))
