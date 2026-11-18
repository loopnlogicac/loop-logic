#include <stdio.h>

int twice(int number)
{
    return number * 2;
}

int main(void)
{
    int value;
    printf("Input: ");
    if (scanf("%d", &value) != 1) {
        return 1;
    }
    printf("Twice=%d\n", twice(value));
    return 0;
}
