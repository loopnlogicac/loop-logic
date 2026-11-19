#include <stdio.h>

static int minimum_coins(const int coins[], int n, int amount, int take[])
{
    int dp[21];
    dp[0] = 0; take[0] = 0;
    for (int a = 1; a <= amount; a++) {
        dp[a] = 21; take[a] = 0;
        for (int i = 0; i < n; i++) {
            int coin = coins[i];
            if (coin <= a && dp[a - coin] + 1 < dp[a]) {
                dp[a] = dp[a - coin] + 1;
                take[a] = coin;
            }
        }
    }
    return dp[amount] == 21 ? -1 : dp[amount];
}

int main(void)
{
    int coins[] = {1, 3, 4}, take[21];
    int amount = 6, count = minimum_coins(coins, 3, amount, take);
    printf("minimum = %d\n", count);
    if (count >= 0) {
        printf("coins:");
        while (amount > 0) { printf(" %d", take[amount]); amount -= take[amount]; }
        putchar('\n');
    }
    return 0;
}
