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
    unsigned long long base, modulus;
    unsigned int exponent;
    puts("Enter base exponent modulus:");
    if (scanf("%llu%u%llu", &base, &exponent, &modulus) != 3 ||
        base > 1000000000ULL || exponent > 1000000000U ||
        modulus < 1 || modulus > 1000000000ULL) { return 1; }
    printf("residue = %llu\n", modular_power(base, exponent, modulus));
    return 0;
}
