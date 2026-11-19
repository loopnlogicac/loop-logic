#include <stdio.h>
#include <stdlib.h>

int *make_mark(int initial)
{
    int *result = malloc(sizeof *result);
    if (result != NULL) {
        *result = initial;
    }
    return result;
}

int main(void)
{
    int *value = make_mark(85);
    if (value == NULL) {
        return 1;
    }
    printf("Returned mark: %d\n", *value);
    free(value);
    return 0;
}
