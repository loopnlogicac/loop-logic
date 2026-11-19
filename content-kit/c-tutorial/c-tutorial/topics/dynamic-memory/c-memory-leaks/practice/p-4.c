#include <stdio.h>
#include <stdlib.h>

const int *find_value(const int *values, size_t count, int target)
{
    for (size_t i = 0; i < count; i++) {
        if (values[i] == target) {
            return &values[i];
        }
    }
    return NULL;
}

int main(void)
{
    int target;
    puts("Target:");
    if (scanf("%d", &target) != 1 || target < -100 || target > 100) {
        return 1;
    }
    int *owner = malloc(3 * sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    owner[0] = 4;
    owner[1] = 7;
    owner[2] = 9;
    const int *found = find_value(owner, 3, target);
    if (found != NULL) {
        printf("Found: %d\n", *found);
    } else {
        puts("missing");
    }
    free(owner);
    return 0;
}
