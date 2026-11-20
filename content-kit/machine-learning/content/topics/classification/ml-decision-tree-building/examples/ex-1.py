import math

TREE_POINTS = [(1, 1, 0), (1, 4, 0), (2, 2, 0), (2, 5, 1),
               (4, 1, 1), (4, 4, 1), (5, 2, 1), (5, 5, 1)]


def impurity(points, criterion="gini"):
    if not points:
        return 0.0
    proportions = [sum(p[2] == label for p in points) / len(points) for label in (0, 1)]
    if criterion == "entropy":
        return -sum(p * math.log2(p) for p in proportions if p > 0)
    return 1 - sum(p * p for p in proportions)


def candidates(points, criterion="gini"):
    parent = impurity(points, criterion)
    rows = []
    for feature in (0, 1):
        values = sorted({p[feature] for p in points})
        for low, high in zip(values, values[1:]):
            threshold = (low + high) / 2
            left = [p for p in points if p[feature] <= threshold]
            right = [p for p in points if p[feature] > threshold]
            weighted = (len(left) * impurity(left, criterion) +
                        len(right) * impurity(right, criterion)) / len(points)
            rows.append((feature, threshold, parent - weighted, left, right))
    return rows


def best_split(points, criterion="gini"):
    best = None
    for row in candidates(points, criterion):
        if row[2] > 1e-12 and (best is None or row[2] > best[2] + 1e-12):
            best = row
    return best


def fit_tree(points, max_depth=2, criterion="gini", min_split=2, depth=0):
    ones = sum(p[2] == 1 for p in points)
    node = {"prediction": int(ones > len(points) - ones), "count": len(points)}
    if depth >= max_depth or len(points) < min_split or impurity(points, criterion) < 1e-12:
        return node
    split = best_split(points, criterion)
    if split is None:
        return node
    feature, threshold, gain, left, right = split
    node.update(feature=feature, threshold=threshold, gain=gain)
    node["left"] = fit_tree(left, max_depth, criterion, min_split, depth + 1)
    node["right"] = fit_tree(right, max_depth, criterion, min_split, depth + 1)
    return node


def predict_tree(tree, point):
    while "left" in tree:
        tree = tree["left"] if point[tree["feature"]] <= tree["threshold"] else tree["right"]
    return tree["prediction"]


def node_count(tree):
    if "left" not in tree:
        return 1
    return 1 + node_count(tree["left"]) + node_count(tree["right"])

def main():
    tree = fit_tree(TREE_POINTS, max_depth=2, criterion="gini", min_split=2)
    prediction = predict_tree(tree, (2, 5))
    correct = sum(predict_tree(tree, p) == p[2] for p in TREE_POINTS)
    nodes = node_count(tree)
    print(f"prediction {prediction}")
    print(f"correct {correct}")
    print(f"nodes {nodes}")


if __name__ == "__main__":
    main()
