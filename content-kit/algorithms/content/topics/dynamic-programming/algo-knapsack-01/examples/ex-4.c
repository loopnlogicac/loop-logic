#include <stdio.h>

static int compact_knapsack(const int weight[], const int value[], int n, int capacity)
{
    int dp[21] = {0};
    for (int i = 0; i < n; i++) {
        for (int c = capacity; c >= weight[i]; c--) {
            int candidate = dp[c - weight[i]] + value[i];
            if (candidate > dp[c]) { dp[c] = candidate; }
        }
    }
    return dp[capacity];
}

int main(void)
{
    int weight[] = {2}, value[] = {3};
    printf("value = %d\n", compact_knapsack(weight, value, 1, 4));
    return 0;
}
