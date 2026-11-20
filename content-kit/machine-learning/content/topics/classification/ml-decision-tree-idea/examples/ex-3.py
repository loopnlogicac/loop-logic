import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree

def main():
    data = load_iris()
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.3, stratify=data.target, random_state=0
    )
    model = DecisionTreeClassifier(max_depth=3, random_state=0)
    model.fit(x_train, y_train)
    fig, ax = plt.subplots(figsize=(9, 5))
    plot_tree(model, feature_names=data.feature_names, class_names=data.target_names,
              filled=True, rounded=True, fontsize=7, ax=ax)
    fig.tight_layout()
    fig.savefig("tree.png", dpi=120)
    plt.close(fig)
    print(f"Root feature: {data.feature_names[model.tree_.feature[0]]}")
    print(f"Test accuracy: {model.score(x_test, y_test):.3f}")
    print("Saved tree.png: feature questions lead to coloured class leaves.")


if __name__ == "__main__":
    main()
