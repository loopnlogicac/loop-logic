#include <stdio.h>

int transfer(int *source, int *destination, int amount)
{
    if (*source < amount) {
        return 0;
    }
    *source -= amount;
    *destination += amount;
    return 1;
}

int main(void)
{
    int source, destination, amount;
    puts("Balances and amount:");
    if (scanf("%d%d%d", &source, &destination, &amount) != 3 ||
        source < 0 || source > 1000 || destination < 0 || destination > 1000 ||
        amount < 0 || amount > 1000) {
        return 1;
    }
    int success = transfer(&source, &destination, amount);
    printf("%d %d %d\n", success, source, destination);
    return 0;
}
