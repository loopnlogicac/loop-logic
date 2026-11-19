#include <stdio.h>

struct Mark { int roll; int score; };

struct Mark boosted(struct Mark input, int bonus)
{
    input.score += bonus;
    return input;
}

int main(void)
{
    struct Mark record = {5, 60};
    printf("Copy: %d Original: %d\n", boosted(record, 5).score, record.score);
    return 0;
}
