#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count, value;
    puts("Count and value:");
    if (scanf("%d %d", &count, &value) != 2 || count < 1 || count > 20
        || value < -100 || value > 100) {
        return 1;
    }
    int *items = malloc((size_t)count * sizeof *items);
    if (items == NULL) {
        return 1;
    }
    for (int i = 0; i < count; i++) {
        items[i] = value;
    }
    printf("%d %d\n", items[0], items[count - 1]);
    free(items);
    return 0;
}
