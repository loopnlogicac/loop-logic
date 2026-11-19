#include <stdio.h>

static int recursive_fib(int n)
{
    if (n < 2) { return n; }
    return recursive_fib(n - 1) + recursive_fib(n - 2);
}

int main(void)
{
    printf("F(7) = %d\n", recursive_fib(7));
    return 0;
}
