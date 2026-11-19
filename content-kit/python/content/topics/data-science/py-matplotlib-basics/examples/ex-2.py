import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def main():
    categories = ["Food", "Travel", "Books"]
    totals = [120, 80, 200]
    fig, ax = plt.subplots(figsize=(6, 4))
    bars = ax.bar(categories, totals, color=["#4477aa", "#228833", "#aa3377"])
    ax.set(xlabel="Category", ylabel="Amount (BDT)", title="Recorded expenses")
    ax.set_ylim(0, 240)
    ax.bar_label(bars, fmt="%.0f")
    fig.tight_layout()
    plt.savefig("plot.png", dpi=120)
    plt.close(fig)
    print("Saved plot.png")


if __name__ == "__main__":
    main()
