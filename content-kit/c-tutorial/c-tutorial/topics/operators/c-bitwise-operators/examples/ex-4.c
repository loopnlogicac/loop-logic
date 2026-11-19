#include <stdio.h>

int main(void)
{
    unsigned int a = 5U;
    unsigned int b = 12U;
    printf("Odd=%u\n", a & 1U);
    a ^= b;
    b ^= a;
    a ^= b;
    printf("%u %u\n", a, b);
    return 0;
}
