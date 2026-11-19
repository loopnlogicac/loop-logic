import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def main():
    hours = [1, 2, 2, 3, 4, 5]
    marks = [35, 45, 55, 65, 70, 80]
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.scatter(hours, marks, color="#4477aa", marker="o")
    ax.set(xlabel="Practice time (hours)", ylabel="Mark (out of 100)",
           title="Practice time and quiz marks")
    ax.set_xlim(0, 6)
    ax.set_ylim(0, 100)
    ax.grid(alpha=0.3)
    fig.tight_layout()
    plt.savefig("plot.png", dpi=120)
    plt.close(fig)
    print("Saved plot.png")


if __name__ == "__main__":
    main()
