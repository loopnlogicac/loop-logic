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
    printf("%lld %lld\n", power(3, 4), power(8, 0));
    return 0;
}
