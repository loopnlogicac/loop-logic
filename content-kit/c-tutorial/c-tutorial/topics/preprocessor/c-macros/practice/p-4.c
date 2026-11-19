#include <stdio.h>

static inline int square(int value)
{
    return value * value;
}

int main(void)
{
    int value;
    puts("Integer:");
    if (scanf("%d", &value) != 1 || value < -10 || value > 10) {
        return 1;
    }
    int result = square(value++);
    printf("%d %d\n", result, value);
    return 0;
}
