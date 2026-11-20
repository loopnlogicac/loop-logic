from sklearn.tree import DecisionTreeClassifier

def main():
    points = [(1, 1, 0), (1, 4, 0), (2, 2, 0), (2, 5, 1),
              (4, 1, 1), (4, 4, 1), (5, 2, 1), (5, 5, 1)]
    model = DecisionTreeClassifier(max_depth=1, min_impurity_decrease=1e-12, random_state=0)
    model.fit([p[:2] for p in points], [p[2] for p in points])
    tree = model.tree_
    left, right = tree.children_left[0], tree.children_right[0]
    weighted = (tree.n_node_samples[left] * tree.impurity[left] +
                tree.n_node_samples[right] * tree.impurity[right]) / tree.n_node_samples[0]
    print(f"bestFeature {'xy'[tree.feature[0]]}")
    print(f"threshold {tree.threshold[0]:.3f}")
    print(f"gain {tree.impurity[0] - weighted:.3f}")


if __name__ == "__main__":
    main()
