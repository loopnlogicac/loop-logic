#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count;
    puts("Counter count:");
    if (scanf("%d", &count) != 1 || count < 1 || count > 20) {
        return 1;
    }
    int *counts = calloc((size_t)count, sizeof *counts);
    if (counts == NULL) {
        return 1;
    }
    int total = 0;
    for (int i = 0; i < count; i++) {
        total += counts[i];
    }
    printf("%d\n", total);
    free(counts);
    return 0;
}
