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
    int amount, coins[] = {1, 3, 4};
    puts("Enter amount:");
    if (scanf("%d", &amount) != 1 || amount < 0 || amount > 20) { return 1; }
    printf("ways = %d\n", count_ways(coins, 3, amount));
    return 0;
}
