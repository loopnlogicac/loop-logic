import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def main():
    weeks = [1, 2, 3, 4]
    hours = [2, 3, 5, 4]
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.plot(weeks, hours, marker="o", label="Practice")
    ax.set(xlabel="Week", ylabel="Hours", title="Weekly practice time")
    ax.set_xticks(weeks)
    ax.set_ylim(bottom=0)
    ax.legend()
    ax.grid(axis="y", alpha=0.3)
    fig.tight_layout()
    plt.savefig("plot.png", dpi=120)
    plt.close(fig)
    print("Saved plot.png")


if __name__ == "__main__":
    main()
