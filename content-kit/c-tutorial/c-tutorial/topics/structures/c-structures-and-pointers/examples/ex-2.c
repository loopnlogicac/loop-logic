#include <stdio.h>
#include <stdlib.h>

struct Mark { int roll; int score; };

int main(void)
{
    struct Mark *owner = malloc(sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    *owner = (struct Mark){9, 88};
    printf("%d %d\n", owner->roll, owner->score);
    free(owner);
    return 0;
}
