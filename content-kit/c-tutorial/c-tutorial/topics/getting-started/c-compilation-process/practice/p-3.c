#include <stdio.h>

int adjust(int number)
{
    return number + 7;
}

int main(void)
{
    int value;
    printf("Input: ");
    if (scanf("%d", &value) != 1) {
        return 1;
    }
    printf("Result=%d\n", adjust(value));
    return 0;
}
