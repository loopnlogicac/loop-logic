#include <stdio.h>

static int memo_fib(int n, int memo[])
{
    if (n < 2) { return n; }
    if (memo[n] != -1) { return memo[n]; }
    memo[n] = memo_fib(n - 1, memo) + memo_fib(n - 2, memo);
    return memo[n];
}

int main(void)
{
    int memo[31];
    for (int i = 0; i < 31; i++) { memo[i] = -1; }
    printf("F(7) = %d\n", memo_fib(7, memo));
    return 0;
}
