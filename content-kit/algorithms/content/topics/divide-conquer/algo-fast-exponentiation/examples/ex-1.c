#include <stdio.h>

static unsigned long long power(unsigned long long base, unsigned int exponent)
{
    unsigned long long result = 1;
    while (exponent > 0) {
        if (exponent % 2 == 1) { result *= base; }
        exponent /= 2;
        if (exponent > 0) { base *= base; }
    }
    return result;
}

int main(void)
{
    printf("%llu\n", power(3, 13));
    return 0;
}
