#include <stdio.h>

int main(void)
{
    int value, base;
    printf("Input: ");
    if (scanf("%d %d", &value, &base) != 2 || value < 0 || value > 1000 || base < 1 || base > 20) {
        return 1;
    }
    value %= base;
    printf("%d\n", value);
    return 0;
}
