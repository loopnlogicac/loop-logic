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
    int n, capacity, weight[12], value[12], chosen[12];
    puts("Enter n capacity and weight value pairs:");
    if (scanf("%d%d", &n, &capacity) != 2 || n < 0 || n > 12 ||
        capacity < 0 || capacity > 20) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d%d", &weight[i], &value[i]) != 2 || weight[i] < 1 ||
            weight[i] > 20 || value[i] < 0 || value[i] > 99) { return 1; }
    }
    int best = knapsack(weight, value, n, capacity, chosen);

    printf("value = %d\nchosen:", best);
    for (int i = 0; i < n; i++) { if (chosen[i]) { printf(" %d", i); } }
    putchar('\n');
    return 0;
}
