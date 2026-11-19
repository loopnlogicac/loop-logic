#include <stdio.h>

enum Level { LEVEL_LOW, LEVEL_MEDIUM = 3, LEVEL_HIGH };

int main(void)
{
    int start;
    puts("Initial code:");
    if (scanf("%d", &start) != 1 || start < 0 || start > 10) {
        return 1;
    }
    printf("%d %d %d\n", start + LEVEL_LOW, start + LEVEL_MEDIUM, start + LEVEL_HIGH);
    return 0;
}
