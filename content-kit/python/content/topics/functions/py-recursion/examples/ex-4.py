from functools import lru_cache


@lru_cache(maxsize=None)
def fibonacci(number):
    """Return F(n), with F(0)=0 and F(1)=1."""
    if number < 2:
        return number
    return fibonacci(number - 1) + fibonacci(number - 2)


print(fibonacci(10))
info = fibonacci.cache_info()
print(info.hits, info.misses, info.currsize)
fibonacci.cache_clear()
print(fibonacci.cache_info().currsize)
