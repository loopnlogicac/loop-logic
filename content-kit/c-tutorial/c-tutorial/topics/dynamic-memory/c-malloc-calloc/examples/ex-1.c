#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    size_t count = 4;
    int *scores = calloc(count, sizeof *scores);
    if (scores == NULL) {
        return 1;
    }
    scores[2] = 9;
    printf("%d %d %d\n", scores[0], scores[2], scores[3]);
    free(scores);
    return 0;
}
