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
    int limit, coins[] = {1, 3, 4}, failure = -1;
    puts("Enter limit:");
    if (scanf("%d", &limit) != 1 || limit < 1 || limit > 20) { return 1; }
    for (int amount = 1; amount <= limit && failure == -1; amount++) {
        int best = amount;
        for (int fours = 0; 4 * fours <= amount; fours++) {
            for (int threes = 0; 4 * fours + 3 * threes <= amount; threes++) {
                int count = fours + threes + amount - 4 * fours - 3 * threes;
                if (count < best) { best = count; }
            }
        }
        if (greedy_coins(coins, 3, amount) != best) { failure = amount; }
    }
    printf("first failure = %d\n", failure);
    return 0;
}
