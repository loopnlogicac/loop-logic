#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *owner = malloc(sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    *owner = 25;
    printf("Before: %d\n", *owner);
    free(owner);
    owner = NULL;
    free(owner);
    printf("Empty: %d\n", owner == NULL);
    return 0;
}
