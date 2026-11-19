#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int total = 0;
    for (int round = 1; round <= 3; round++) {
        int *value = malloc(sizeof *value);
        if (value == NULL) {
            return 1;
        }
        *value = round * 10;
        total += *value;
        free(value);
    }
    printf("Total: %d\n", total);
    return 0;
}
