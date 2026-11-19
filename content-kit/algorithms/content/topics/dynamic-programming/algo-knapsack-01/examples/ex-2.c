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
    int weight[] = {2, 3, 4}, value[] = {4, 5, 7};
    printf("value = %d\n", compact_knapsack(weight, value, 3, 5));
    return 0;
}
