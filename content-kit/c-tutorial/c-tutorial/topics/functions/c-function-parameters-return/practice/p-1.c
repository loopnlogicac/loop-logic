#include <stdio.h>

int clamp(int value)
{
    if (value < 0) {
        return 0;
    }
    if (value > 100) {
        return 100;
    }
    return value;
}

int main(void)
{
    int value;
    puts("Raw mark:");
    if (scanf("%d", &value) != 1 || value < -100 || value > 200) {
        return 1;
    }
    printf("%d\n", clamp(value));
    return 0;
}
