#include <stdio.h>
#include <stdlib.h>

int sum(const int *values, size_t count)
{
    int total = 0;
    for (size_t i = 0; i < count; i++) {
        total += values[i];
    }
    return total;
}

int main(void)
{
    int *owner = malloc(3 * sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    owner[0] = 4;
    owner[1] = 7;
    owner[2] = 9;
    const int *view = owner;
    printf("Borrowed sum: %d\n", sum(view, 3));
    free(owner);
    return 0;
}
