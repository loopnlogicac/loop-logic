import numpy as np

BIAS_POINTS = [(-2, 4.2), (-1.5, 2.0), (-1, 1.1), (-0.5, 0.1), (0, 0.2),
               (0.5, 0.4), (1, 0.8), (1.5, 2.4), (2, 3.8)]
BIAS_VALIDATION = [(x, x * x) for x in (-1.75, -0.75, 0.25, 1.25)]


def bootstrap_indices(count, seed, repetitions=3):
    state = seed & 0xFFFFFFFF
    groups = []
    for _ in range(repetitions):
        chosen = []
        for _ in range(count):
            state = (1664525 * state + 1013904223) & 0xFFFFFFFF
            chosen.append(state * count // 4294967296)
        groups.append(chosen)
    return groups


def design(points, degree):
    return np.array([[x ** power for power in range(degree + 1)] for x, _ in points])


def ridge_coefficients(points, degree):
    matrix = design(points, degree)
    target = np.array([y for _, y in points])
    return np.linalg.solve(matrix.T @ matrix + 0.001 * np.eye(degree + 1), matrix.T @ target)


def bias_summary(points, validation, degree=2, seed=0, library=False):
    train_errors, validation_errors, predictions = [], [], []
    for indices in bootstrap_indices(len(points), seed):
        sample = [points[i] for i in indices]
        if library:
            from sklearn.linear_model import Ridge
            model = Ridge(alpha=0.001, fit_intercept=False).fit(
                design(sample, degree), [y for _, y in sample]
            )
            coefficients = model.coef_
        else:
            coefficients = ridge_coefficients(sample, degree)
        train_prediction = design(sample, degree) @ coefficients
        val_prediction = design(validation, degree) @ coefficients
        train_errors.append(np.mean((train_prediction - [y for _, y in sample]) ** 2))
        validation_errors.append(np.mean((val_prediction - [y for _, y in validation]) ** 2))
        predictions.append(val_prediction)
    return (float(np.mean(train_errors)), float(np.mean(validation_errors)),
            float(np.var(np.array(predictions), axis=0).mean()))

def main():
    try:
        degree = int(input())
        n = int(input())
        if not (1 <= degree <= 5 and 6 <= n <= 20):
            raise ValueError
        rows = [tuple(map(float, input().split())) for _ in range(n)]
        if any(len(p) != 2 or not (-2 <= p[0] <= 2 and -4 <= p[1] <= 6) for p in rows):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    coefficients = ridge_coefficients(rows, degree)
    print(" ".join(f"{0.0 if abs(v) < 0.0005 else v:.3f}" for v in coefficients))


if __name__ == "__main__":
    main()
