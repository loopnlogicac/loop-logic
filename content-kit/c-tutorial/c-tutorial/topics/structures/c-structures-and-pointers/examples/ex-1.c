#include <stdio.h>

struct Mark { int roll; int score; };

int main(void)
{
    struct Mark record = {7, 60};
    struct Mark *pointer = &record;
    pointer->score += 5;
    printf("%d %d\n", pointer->roll, record.score);
    return 0;
}
