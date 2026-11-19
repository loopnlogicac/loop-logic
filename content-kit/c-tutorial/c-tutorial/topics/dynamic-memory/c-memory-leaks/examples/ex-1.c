#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *first = malloc(sizeof *first);
    if (first == NULL) {
        return 1;
    }
    int *second = malloc(sizeof *second);
    if (second == NULL) {
        free(first);
        return 1;
    }
    *first = 12;
    *second = 18;
    printf("Sum: %d\n", *first + *second);
    free(second);
    free(first);
    return 0;
}
