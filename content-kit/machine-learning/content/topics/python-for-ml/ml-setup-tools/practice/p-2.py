major, minor = map(int, input().split())
print("supported" if (major, minor) >= (3, 10) else "upgrade")
