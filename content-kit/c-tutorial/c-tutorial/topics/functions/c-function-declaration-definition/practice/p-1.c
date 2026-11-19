#include <stdio.h>
int minutes(int hours);
int main(void)
{
    int value;
    puts("Value:");
    if (scanf("%d", &value) != 1 || value < 0 || value > 24) {
        return 1;
    }
    printf("%d\n", minutes(value));
    return 0;
}
int minutes(int hours)
{
    return hours * 60;
}
