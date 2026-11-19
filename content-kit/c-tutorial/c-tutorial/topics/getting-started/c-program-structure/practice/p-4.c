#include <stdio.h>

int plus_one(int number)
{
    return number + 1;
}

int twice(int number)
{
    return 2 * number;
}

int main(void)
{
    int value;
    printf("Input: ");
    if (scanf("%d", &value) != 1) {
        return 1;
    }
    printf("Plus=%d\nDouble=%d\n", plus_one(value), twice(value));
    return 0;
}
