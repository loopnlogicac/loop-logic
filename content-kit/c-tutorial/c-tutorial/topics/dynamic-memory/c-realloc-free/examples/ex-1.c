#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *items = malloc(2 * sizeof *items);
    if (items == NULL) {
        return 1;
    }
    items[0] = 10;
    items[1] = 20;
    int *next = realloc(items, 4 * sizeof *items);
    if (next == NULL) {
        free(items);
        return 1;
    }
    items = next;
    items[2] = 30;
    items[3] = 40;
    printf("%d %d\n", items[0], items[3]);
    free(items);
    return 0;
}
