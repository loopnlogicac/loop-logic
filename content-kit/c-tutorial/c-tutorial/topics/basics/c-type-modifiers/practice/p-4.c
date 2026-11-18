#include <stdio.h>

int main(void)
{
    unsigned int number;
    printf("Input: ");
    if (scanf("%u", &number) != 1) {
        return 1;
    }
    printf("Next=%u\n", number + 1U);
    return 0;
}
