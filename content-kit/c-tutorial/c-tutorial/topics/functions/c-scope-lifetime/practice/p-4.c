#include <stdio.h>

int doubled(int value)
{
    value *= 2;
    return value;
}

int main(void)
{
    int value;
    puts("Input:");
    if (scanf("%d", &value) != 1 || value < 0 || value > 100) {
        return 1;
    }
    printf("%d %d\n", doubled(value), value);
    return 0;
}
