from functools import lru_cache


@lru_cache(maxsize=None)
def ways(steps):
    if steps < 2:
        return 1
    return ways(steps - 1) + ways(steps - 2)


print(ways(int(input())))
