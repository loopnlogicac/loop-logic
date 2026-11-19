#include <stdio.h>

static int greedy_coins(const int coins[], int n, int amount)
{
    int count = 0;
    for (int i = n - 1; i >= 0; i--) {
        count += amount / coins[i];
        amount %= coins[i];
    }
    return amount == 0 ? count : -1;
}

int main(void)
{
    int coins[] = {1, 3, 4};
    printf("greedy = %d, alternative = %d\n", greedy_coins(coins, 3, 6), 2);
    return 0;
}
