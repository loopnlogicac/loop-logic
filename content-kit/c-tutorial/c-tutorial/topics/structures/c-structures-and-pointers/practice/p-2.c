#include <stdio.h>
#include <stdlib.h>

struct Mark { int roll; int score; };

int main(void)
{
    int roll, score;
    puts("Roll and score:");
    if (scanf("%d %d", &roll, &score) != 2 || roll < 1 || roll > 999
        || score < 0 || score > 100) {
        return 1;
    }
    struct Mark *owner = malloc(sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    *owner = (struct Mark){roll, score};
    printf("%d %d\n", owner->roll, owner->score);
    free(owner);
    return 0;
}
