#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int value;
    puts("Value:");
    if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
        return 1;
    }
    int *owner = malloc(sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    *owner = value;
    printf("Saved: %d\n", *owner);
    free(owner);
    owner = NULL;
    printf("Empty: %d\n", owner == NULL);
    return 0;
}
