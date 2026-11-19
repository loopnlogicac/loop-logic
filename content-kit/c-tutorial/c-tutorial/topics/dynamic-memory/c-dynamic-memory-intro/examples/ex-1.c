#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *mark = malloc(sizeof *mark);
    if (mark == NULL) {
        return 1;
    }
    *mark = 78;
    printf("Mark: %d\n", *mark);
    free(mark);
    return 0;
}
