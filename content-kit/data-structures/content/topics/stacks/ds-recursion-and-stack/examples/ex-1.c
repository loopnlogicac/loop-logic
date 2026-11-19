#include <stdio.h>

static long factorial(int n)
{
    if (n == 0) {
        return 1;
    }
    long child = factorial(n - 1);
    printf("Resume %d with %ld\n", n, child);
    return n * child;
}

int main(void)
{
    int n;
    puts("n (0..10):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) {
        return 1;
    }
    printf("Factorial: %ld\n", factorial(n));
    return 0;
}
