#include <stdio.h>

int main(void)
{
    int automatic, decimal;
    printf("Input: ");
    if (scanf("%i %d", &automatic, &decimal) != 2) {
        return 1;
    }
    printf("Auto=%d Decimal=%d\n", automatic, decimal);
    return 0;
}
