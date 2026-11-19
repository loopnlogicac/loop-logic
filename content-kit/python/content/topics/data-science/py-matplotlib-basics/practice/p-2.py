import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def main():
    count = int(input())
    rows = [input().split() for _ in range(count)]
    names = [row[0] for row in rows]
    amounts = [int(row[1]) for row in rows]
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.bar(names, amounts)
    ax.set(xlabel="Category", ylabel="Amount (BDT)", title="Spending")
    ax.set_ylim(0, max(1, max(amounts)) * 1.2)
    fig.tight_layout()
    plt.savefig("plot.png", dpi=120)
    plt.close(fig)
    print("Saved plot.png")


if __name__ == "__main__":
    main()
