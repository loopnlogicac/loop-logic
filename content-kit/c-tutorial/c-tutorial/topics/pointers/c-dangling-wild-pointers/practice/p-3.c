#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int input;
    puts("Owned score:");
    if (scanf("%d", &input) != 1 || input < -100 || input > 100) {
        return 1;
    }
    int *owner = malloc(sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    *owner = 2 * input;
    printf("%d\n", *owner);
    free(owner);
    owner = NULL;
    return 0;
}
