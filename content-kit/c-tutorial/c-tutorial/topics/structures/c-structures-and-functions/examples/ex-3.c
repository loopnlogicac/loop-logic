#include <stdio.h>

struct Mark { int roll; int score; };

struct Mark choose(struct Mark a, struct Mark b)
{
    if (b.score > a.score || (b.score == a.score && b.roll < a.roll)) {
        return b;
    }
    return a;
}

int main(void)
{
    struct Mark first = {8, 75};
    struct Mark second = {3, 75};
    struct Mark winner = choose(first, second);
    printf("Winner: %d %d\n", winner.roll, winner.score);
    return 0;
}
