#include <stdio.h>
int twice(int hours);
int main(void)
{
    int value;
    puts("Value:");
    if (scanf("%d", &value) != 1 || value < 0 || value > 100) {
        return 1;
    }
    printf("%d\n", twice(value) + twice(value + 1));
    return 0;
}
int twice(int hours)
{
    return hours * 2;
}
