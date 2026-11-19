#include <stdio.h>

unsigned long long factorial(unsigned int n)
{
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main(void)
{
    printf("%llu\n", factorial(5));
    return 0;
}
