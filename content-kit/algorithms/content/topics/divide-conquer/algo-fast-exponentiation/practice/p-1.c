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
    unsigned long long base;
    unsigned int exponent;
    puts("Enter base and exponent:");
    if (scanf("%llu%u", &base, &exponent) != 2 || base > 10 || exponent > 18) { return 1; }
    printf("power = %llu\n", power(base, exponent));
    return 0;
}
