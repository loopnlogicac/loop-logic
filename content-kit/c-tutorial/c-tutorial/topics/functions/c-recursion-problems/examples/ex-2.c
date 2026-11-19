#include <stdio.h>

unsigned int digit_sum(unsigned int value)
{
    if (value < 10) {
        return value;
    }
    return value % 10 + digit_sum(value / 10);
}

unsigned int gcd(unsigned int a, unsigned int b)
{
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

int main(void)
{
    printf("%u %u\n", digit_sum(5072), gcd(84, 30));
    return 0;
}
