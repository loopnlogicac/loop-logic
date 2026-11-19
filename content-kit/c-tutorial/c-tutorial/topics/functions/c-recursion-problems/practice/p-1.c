#include <stdio.h>

long long power(long long base, unsigned int exponent)
{
    if (exponent == 0) {
        return 1;
    }
    return base * power(base, exponent - 1);
}

int main(void)
{
    long long base;
    unsigned int exponent;
    puts("Base and exponent:");
    if (scanf("%lld%u", &base, &exponent) != 2 || base < -10 || base > 10 ||
        exponent > 10) {
        return 1;
    }
    printf("%lld\n", power(base, exponent));
    return 0;
}
