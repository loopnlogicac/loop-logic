robotics = {1, 2, 4}
coding = {2, 3, 4}
print(sorted(robotics | coding))
print(sorted(robotics & coding))
print(sorted(robotics - coding))
print(sorted(robotics ^ coding))
print({2, 4} <= coding)
