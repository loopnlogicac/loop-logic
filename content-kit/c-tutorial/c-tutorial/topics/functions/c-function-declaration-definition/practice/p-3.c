#include <stdio.h>
int fee(int hours);
int main(void)
{
    int value;
    puts("Value:");
    if (scanf("%d", &value) != 1 || value < 0 || value > 24) {
        return 1;
    }
    printf("%d\n", fee(value));
    return 0;
}
int fee(int hours)
{
    return hours <= 2 ? 30 : 30 + (hours - 2) * 10;
}
