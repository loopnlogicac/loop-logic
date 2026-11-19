#include <stdio.h>

struct Mark { int roll; int score; };

void add_bonus(struct Mark *record, int bonus)
{
    record->score += bonus;
}

int main(void)
{
    struct Mark record = {5, 60};
    add_bonus(&record, 5);
    printf("Updated: %d\n", record.score);
    return 0;
}
