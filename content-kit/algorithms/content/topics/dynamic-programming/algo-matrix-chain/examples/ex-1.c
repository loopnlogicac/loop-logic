#include <stdio.h>

static int matrix_chain(const int dims[], int n, int split[12][12])
{
    int dp[12][12] = {{0}};
    for (int length = 2; length <= n; length++) {
        for (int i = 0; i + length <= n; i++) {
            int j = i + length - 1;
            dp[i][j] = 1000000000;
            for (int k = i; k < j; k++) {
                int candidate = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                if (candidate < dp[i][j]) { dp[i][j] = candidate; split[i][j] = k; }
            }
        }
    }
    return dp[0][n - 1];
}
static void order(int split[12][12], int i, int j)
{
    if (i == j) { printf("A%d", i + 1); return; }
    putchar('(');
    order(split, i, split[i][j]);
    order(split, split[i][j] + 1, j);
    putchar(')');
}

int main(void)
{
    int dims[] = {10, 30, 5, 60}, split[12][12] = {{0}};
    printf("cost = %d\n", matrix_chain(dims, 3, split));
    order(split, 0, 2); putchar('\n');
    return 0;
}
