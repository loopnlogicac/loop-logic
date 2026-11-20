from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

def main():
    data = load_iris()
    x_train, x_val, y_train, y_val = train_test_split(
        data.data, data.target, test_size=0.3, stratify=data.target, random_state=0
    )
    base = DecisionTreeClassifier(random_state=0)
    path = base.cost_complexity_pruning_path(x_train, y_train)
    print(f"Training-path alpha candidates: {len(path.ccp_alphas)}")
    for alpha in (0.0, 0.02, 0.05):
        model = DecisionTreeClassifier(ccp_alpha=alpha, random_state=0)
        model.fit(x_train, y_train)
        print(
            f"Alpha {alpha:.2f}: leaves {model.get_n_leaves()}; "
            f"validation {model.score(x_val, y_val):.3f}"
        )


if __name__ == "__main__":
    main()
