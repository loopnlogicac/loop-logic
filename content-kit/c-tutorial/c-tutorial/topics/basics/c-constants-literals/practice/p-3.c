#include <stdio.h>

int main(void)
{
    unsigned int number;
    printf("Input: ");
    if (scanf("%u", &number) != 1) {
        return 1;
    }
    printf("dec=%u oct=%o hex=%x\n", number, number, number);
    return 0;
}
