from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def main():
    pairs = [(0, 0)] * 6 + [(0, 1)] * 2 + [(1, 0)] + [(1, 1)] * 3
    truth = [a for a, _ in pairs]
    predicted = [b for _, b in pairs]
    metrics = {
        "accuracy": accuracy_score(truth, predicted),
        "precision": precision_score(truth, predicted, zero_division=0),
        "recall": recall_score(truth, predicted, zero_division=0),
        "f1": f1_score(truth, predicted, zero_division=0),
    }
    for name in ("accuracy", "precision", "recall", "f1"):
        print(f"{name} {metrics[name]:.3f}")


if __name__ == "__main__":
    main()
