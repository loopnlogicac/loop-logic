#include <stdio.h>

#define PLUS_ONE(x) ((x) + 1)

int main(void)
{
    int value;
    puts("Integer:");
    if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
        return 1;
    }
    printf("%d\n", 2 * PLUS_ONE(value));
    return 0;
}
