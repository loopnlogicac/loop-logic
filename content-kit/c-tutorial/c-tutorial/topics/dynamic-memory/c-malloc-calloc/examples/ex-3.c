#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    unsigned int *counts = calloc(3, sizeof *counts);
    if (counts == NULL) {
        return 1;
    }
    int groups[] = {1, 0, 1, 2, 1};
    for (size_t i = 0; i < sizeof groups / sizeof groups[0]; i++) {
        counts[groups[i]]++;
    }
    printf("%u %u %u\n", counts[0], counts[1], counts[2]);
    free(counts);
    return 0;
}
