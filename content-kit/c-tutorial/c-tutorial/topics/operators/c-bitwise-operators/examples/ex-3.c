#include <stdio.h>

int main(void)
{
    unsigned int value = 10U;
    printf("%u %u %u\n", (~value) & 15U, value << 1, value >> 1);
    return 0;
}
