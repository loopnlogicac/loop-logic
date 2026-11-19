#include <stdio.h>

#define SQUARE(x) ((x) * (x))

int main(void)
{
    int value;
    puts("Integer:");
    if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
        return 1;
    }
    printf("%d\n", SQUARE(value));
    return 0;
}
