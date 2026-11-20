import math
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.neighbors import KNeighborsClassifier

def main():
    points = [(1, 1, 0), (1, 2, 0), (2, 1, 0), (2, 2, 0), (4, 4, 0),
              (4, 5, 1), (5, 4, 1), (5, 5, 1), (4, 4.6, 1), (3, 4, 1)]
    cv = StratifiedKFold(n_splits=5, shuffle=False)
    scores = list(cross_val_score(KNeighborsClassifier(n_neighbors=1, algorithm="brute"),
                                  [p[:2] for p in points], [p[2] for p in points], cv=cv))
    mean = sum(scores) / len(scores)
    spread = math.sqrt(sum((s - mean) ** 2 for s in scores) / len(scores))
    print("status finished")
    print(f"folds {len(scores)}")
    print(f"mean {mean:.3f}")
    print(f"spread {spread:.3f}")
    print("foldScores " + ",".join(f"{s:.2f}" for s in scores))


if __name__ == "__main__":
    main()
