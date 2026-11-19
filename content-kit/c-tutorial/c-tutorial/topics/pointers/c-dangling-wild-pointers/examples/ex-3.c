#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *owner = malloc(sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    *owner = 45;
    printf("%d\n", *owner);
    free(owner);
    owner = NULL;
    puts(owner == NULL ? "Released" : "Owned");
    return 0;
}
