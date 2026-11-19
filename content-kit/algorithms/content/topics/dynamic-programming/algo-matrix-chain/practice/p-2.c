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
    int n, dims[13], split[12][12] = {{0}};
    puts("Enter matrix count and dimensions:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 12) { return 1; }
    for (int i = 0; i <= n; i++) {
        if (scanf("%d", &dims[i]) != 1 || dims[i] < 1 || dims[i] > 100) { return 1; }
    }
    int cost = matrix_chain(dims, n, split);

    int left_cost = 0;
    for (int i = 1; i < n; i++) { left_cost += dims[0] * dims[i] * dims[i + 1]; }
    printf("saving = %d\n", left_cost - cost);
    order(split, 0, n - 1); putchar('\n');
    return 0;
}
