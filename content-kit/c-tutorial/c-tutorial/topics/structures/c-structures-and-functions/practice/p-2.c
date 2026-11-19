#include <stdio.h>

struct Mark { int roll; int score; };

void update(struct Mark *record, int bonus)
{
    record->score += bonus;
    if (record->score > 100) {
        record->score = 100;
    }
}

int main(void)
{
    struct Mark input = {1, 0};
    int bonus;
    puts("Score and bonus:");
    if (scanf("%d %d", &input.score, &bonus) != 2 || input.score < 0 || input.score > 100
        || bonus < 0 || bonus > 20) {
        return 1;
    }
    update(&input, bonus);
    printf("%d\n", input.score);
    return 0;
}
