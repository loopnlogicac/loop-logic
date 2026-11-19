#include <stdio.h>
#include <stddef.h>

int main(void)
{
    int values[5] = {0};
    int a, b;
    puts("Positions:");
    if (scanf("%d %d", &a, &b) != 2 || a < 0 || a > 5 || b < 0 || b > 5) {
        return 1;
    }
    ptrdiff_t gap = (values + b) - (values + a);
    printf("%td\n", gap);
    return 0;
}
