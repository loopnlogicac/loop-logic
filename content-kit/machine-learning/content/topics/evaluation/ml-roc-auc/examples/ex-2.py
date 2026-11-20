from sklearn.metrics import roc_curve, roc_auc_score, auc as integrate_auc, confusion_matrix

def main():
    truth = [0, 0, 1, 0, 1, 1]
    scores = [0.1, 0.3, 0.45, 0.6, 0.8, 0.9]
    curve_fpr, curve_tpr, thresholds = roc_curve(truth, scores, drop_intermediate=False)
    area = roc_auc_score(truth, scores)
    assert abs(integrate_auc(curve_fpr, curve_tpr) - area) < 1e-12
    predicted = [int(score >= 0.5) for score in scores]
    matrix = confusion_matrix(truth, predicted, labels=[0, 1])
    fpr = matrix[0, 1] / matrix[0].sum()
    tpr = matrix[1, 1] / matrix[1].sum()
    print("status defined")
    print(f"auc {area:.3f}")
    print(f"selectedFPR {fpr:.3f}")
    print(f"selectedTPR {tpr:.3f}")


if __name__ == "__main__":
    main()
