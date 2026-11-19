#include <stdio.h>

static unsigned long long recursive_power(unsigned long long base, unsigned int exponent)
{
    if (exponent == 0) { return 1; }
    unsigned long long half = recursive_power(base, exponent / 2);
    return exponent % 2 == 0 ? half * half : half * half * base;
}

int main(void)
{
    printf("%llu\n", recursive_power(2, 10));
    return 0;
}
