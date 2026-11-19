#include <stdio.h>

struct Mark { int roll; int score; };

const struct Mark *choose_view(const struct Mark *a, const struct Mark *b)
{
    if (b->score > a->score || (b->score == a->score && b->roll < a->roll)) {
        return b;
    }
    return a;
}

int main(void)
{
    struct Mark a = {0}, b = {0};
    puts("Two roll-score pairs:");
    if (scanf("%d %d %d %d", &a.roll, &a.score, &b.roll, &b.score) != 4
        || a.roll < 1 || a.roll > 999 || b.roll < 1 || b.roll > 999
        || a.score < 0 || a.score > 100 || b.score < 0 || b.score > 100) {
        return 1;
    }
    const struct Mark *winner = choose_view(&a, &b);
    printf("%d %d\n", winner->roll, winner->score);
    return 0;
}
