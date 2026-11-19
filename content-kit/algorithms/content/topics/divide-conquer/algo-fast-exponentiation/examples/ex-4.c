#include <stdio.h>

static unsigned long long modular_power(unsigned long long base, unsigned int exponent,
                                        unsigned long long modulus)
{
    unsigned long long result = 1 % modulus;
    base %= modulus;
    while (exponent > 0) {
        if (exponent % 2 == 1) { result = result * base % modulus; }
        base = base * base % modulus;
        exponent /= 2;
    }
    return result;
}

int main(void)
{
    printf("%llu %llu\n", modular_power(7, 0, 11), modular_power(7, 0, 1));
    return 0;
}
