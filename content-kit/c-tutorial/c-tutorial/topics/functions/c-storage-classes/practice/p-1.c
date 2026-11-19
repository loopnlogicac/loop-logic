#include <stdio.h>

int accumulate(int amount)
{
    static int total;
    total += amount;
    return total;
}

int main(void)
{
    int n;
    puts("Count and amounts:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 8) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int amount;
        if (scanf("%d", &amount) != 1 || amount < -100 || amount > 100) {
            return 1;
        }
        printf("%d\n", accumulate(amount));
    }
    return 0;
}
