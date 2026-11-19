a, b, test = map(int, input().split())
n = a + b
numerators = [a * test, b * test]
sizes = [v // n for v in numerators]
if sum(sizes) < test:
    winner = 0 if numerators[0] % n >= numerators[1] % n else 1
    sizes[winner] += 1
print(*sizes)
