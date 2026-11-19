#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *items = malloc(4 * sizeof *items);
    if (items == NULL) {
        return 1;
    }
    for (int i = 0; i < 4; i++) {
        items[i] = (i + 1) * 5;
    }
    int *next = realloc(items, 2 * sizeof *items);
    if (next == NULL) {
        free(items);
        return 1;
    }
    items = next;
    printf("%d %d\n", items[0], items[1]);
    free(items);
    return 0;
}
