#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *owner = malloc(sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    *owner = 9;
    int *alias = owner;
    free(owner);
    owner = NULL;
    printf("%d\n", *alias);
    return 0;
}
