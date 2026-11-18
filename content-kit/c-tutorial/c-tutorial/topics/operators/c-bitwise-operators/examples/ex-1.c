#include <stdio.h>

int main(void)
{
    unsigned int a = 12U;
    unsigned int b = 10U;
    printf("%u %u %u\n", a & b, a | b, a ^ b);
    return 0;
}
