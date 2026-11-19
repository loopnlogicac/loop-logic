#include <stdio.h>
int cube(int hours);
int main(void)
{
    int value;
    puts("Value:");
    if (scanf("%d", &value) != 1 || value < -20 || value > 20) {
        return 1;
    }
    printf("%d\n", cube(value));
    return 0;
}
int cube(int hours)
{
    return hours * hours * hours;
}
