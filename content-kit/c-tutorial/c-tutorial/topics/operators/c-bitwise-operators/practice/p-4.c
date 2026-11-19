#include <stdio.h>

int main(void)
{
    unsigned int value, position;
    printf("Input: ");
    if (scanf("%u %u", &value, &position) != 2 || value > 255U || position > 7U) {
        return 1;
    }
    unsigned int mask = 1U << position;
    value ^= mask;
    printf("%u %d\n", value, (value & mask) != 0U);
    return 0;
}
