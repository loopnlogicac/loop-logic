#include <stdio.h>

static int knapsack(const int weight[], const int value[], int n, int capacity,
                    int chosen[])
{
    int dp[13][21] = {{0}};
    for (int i = 1; i <= n; i++) {
        for (int c = 0; c <= capacity; c++) {
            dp[i][c] = dp[i - 1][c];
            if (weight[i - 1] <= c) {
                int candidate = value[i - 1] + dp[i - 1][c - weight[i - 1]];
                if (candidate > dp[i][c]) { dp[i][c] = candidate; }
            }
        }
    }
    int c = capacity;
    for (int i = n; i > 0; i--) {
        chosen[i - 1] = dp[i][c] != dp[i - 1][c];
        if (chosen[i - 1]) { c -= weight[i - 1]; }
    }
    return dp[n][capacity];
}

int main(void)
{
    int weight[] = {2, 3, 4}, value[] = {4, 5, 7}, chosen[3];
    printf("value = %d\n", knapsack(weight, value, 3, 0, chosen));
    printf("chosen:");
    for (int i = 0; i < 3; i++) { if (chosen[i]) { printf(" %d", i); } }
    putchar('\n');
    return 0;
}
