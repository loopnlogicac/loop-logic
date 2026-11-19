#include <stdio.h>
#include <stdlib.h>

struct Mark { int roll; int score; };

int main(void)
{
    struct Mark *owner = malloc(2 * sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    owner[0] = (struct Mark){1, 50};
    owner[1] = (struct Mark){2, 75};
    struct Mark *view = owner + 1;
    view->score = 80;
    printf("%d %d\n", owner[0].score, owner[1].score);
    free(owner);
    return 0;
}
