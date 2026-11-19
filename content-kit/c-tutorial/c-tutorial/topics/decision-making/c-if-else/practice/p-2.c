#include <stdio.h>

int main(void)
{
    int number;
    printf("Input: ");
    if (scanf("%d", &number) != 1 || number < -100 || number > 100) {
        return 1;
    }
    if (number % 2 == 0) {
        puts("Even");
    } else {
        puts("Odd");
    }
    return 0;
}
