def shuffle(values, state):
    values = list(values)
    for i in range(len(values) - 1, 0, -1):
        state = (1664525 * state + 1013904223) % 4294967296
        j = int(state / 4294967296 * (i + 1))
        values[i], values[j] = values[j], values[i]
    return values, state

def split_counts(labels, seed):
    n = len(labels)
    test_n = int(n * 0.3 + 0.5)
    order, _ = shuffle(range(n), seed)
    random_test = order[:test_n]
    groups = [[i for i, y in enumerate(labels) if y == c] for c in [0, 1]]
    quotas = [len(g) * test_n / n for g in groups]
    sizes = [int(q) for q in quotas]
    for c in sorted([0, 1], key=lambda c: (-(quotas[c] - sizes[c]), c))[:test_n-sum(sizes)]:
        sizes[c] += 1
    stratified_test = []
    state = seed
    for c, group in enumerate(groups):
        group, state = shuffle(group, state)
        stratified_test.extend(group[:sizes[c]])
    return random_test, stratified_test

if __name__ == "__main__":
    labels = [0] * 7 + [1] * 3
    random_test, stratified_test = split_counts(labels, 7)
    print(f"Train: {len(labels)-len(stratified_test)}")
    print(f"Test: {len(stratified_test)}")
    print(f"Random test minority: {sum(labels[i] for i in random_test)}")
    print(f"Stratified test minority: {sum(labels[i] for i in stratified_test)}")
