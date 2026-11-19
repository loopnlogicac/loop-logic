#include <stdio.h>

static int fibonacci(int n)
{
    int dp[31] = {0, 1};
    for (int i = 2; i <= n; i++) { dp[i] = dp[i - 1] + dp[i - 2]; }
    return dp[n];
}

int main(void)
{
    int n;
    puts("Enter n:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) { return 1; }
    printf("value = %d\n", fibonacci(n));
    return 0;
}
