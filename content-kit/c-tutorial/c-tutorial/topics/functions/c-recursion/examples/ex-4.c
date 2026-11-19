#include <stdio.h>

unsigned long long factorial(unsigned int n)
{
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

unsigned long long factorial_loop(unsigned int n)
{
    unsigned long long product = 1;
    for (unsigned int factor = 2; factor <= n; factor++) {
        product *= factor;
    }
    return product;
}

int main(void)
{
    printf("%llu %llu\n", factorial(6), factorial_loop(6));
    return 0;
}
