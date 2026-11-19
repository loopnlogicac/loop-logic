#include <stdio.h>

unsigned long long fibonacci(unsigned int n)
{
    if (n < 2) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main(void)
{
    for (unsigned int n = 0; n <= 7; n++) {
        printf("%llu%s", fibonacci(n), n == 7 ? "\n" : " ");
    }
    return 0;
}
