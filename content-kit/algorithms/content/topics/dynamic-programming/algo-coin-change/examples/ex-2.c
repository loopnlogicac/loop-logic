#include <stdio.h>

static int count_ways(const int coins[], int n, int amount)
{
    int ways[21] = {1};
    for (int i = 0; i < n; i++) {
        for (int a = coins[i]; a <= amount; a++) { ways[a] += ways[a - coins[i]]; }
    }
    return ways[amount];
}

int main(void)
{
    int coins[] = {1, 3, 4};
    printf("ways = %d\n", count_ways(coins, 3, 6));
    return 0;
}
