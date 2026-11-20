from sklearn.metrics import confusion_matrix

def main():
    scores = [0.1, 0.3, 0.45, 0.6, 0.8, 0.9]
    truth = [0, 0, 1, 0, 1, 1]
    predicted = [int(score >= 0.5) for score in scores]
    matrix = confusion_matrix(truth, predicted, labels=[0, 1])
    counts = {"tn": int(matrix[0, 0]), "fp": int(matrix[0, 1]),
              "fn": int(matrix[1, 0]), "tp": int(matrix[1, 1])}
    for key in ("tn", "fp", "fn", "tp"):
        print(f"{key} {counts[key]}")


if __name__ == "__main__":
    main()
