import math


def sigmoid(score):
    if score >= 0:
        return 1 / (1 + math.exp(-score))
    exponent = math.exp(score)
    return exponent / (1 + exponent)


def train(points, rate=0.3, epochs=400, strength=1 / 6):
    w = [0.4, -0.2]
    b = 0.5
    for _ in range(epochs):
        gw = [strength * w[0], strength * w[1]]
        gb = 0.0
        for x, y, label in points:
            error = sigmoid(w[0] * x + w[1] * y + b) - label
            gw[0] += error * x / len(points)
            gw[1] += error * y / len(points)
            gb += error / len(points)
        w = [w[j] - rate * gw[j] for j in (0, 1)]
        b -= rate * gb
        if max(abs(w[0]), abs(w[1]), abs(b)) > 1000000:
            return w, b, "diverged"
    return w, b, "finished"


def objective(points, w, b, strength):
    loss = 0.0
    for x, y, label in points:
        score = w[0] * x + w[1] * y + b
        loss += max(score, 0) - label * score + math.log1p(math.exp(-abs(score)))
    return loss / len(points) + strength * sum(value * value for value in w) / 2

def main():
    try:
        w1, w2, bias, x, y, threshold = map(float, input().split())
        if not (all(-10 <= v <= 10 for v in (w1, w2, bias, x, y)) and 0 < threshold < 1):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    p = sigmoid(w1 * x + w2 * y + bias)
    print(f"{p:.3f} {int(p >= threshold)}")


if __name__ == "__main__":
    main()
