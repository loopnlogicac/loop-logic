#include <stdio.h>

struct Mark { int roll; int score; };

struct Mark capped_bonus(struct Mark record, int bonus)
{
    record.score += bonus;
    if (record.score > 100) {
        record.score = 100;
    }
    return record;
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
    struct Mark result = capped_bonus(input, bonus);
    printf("%d %d\n", input.score, result.score);
    return 0;
}
