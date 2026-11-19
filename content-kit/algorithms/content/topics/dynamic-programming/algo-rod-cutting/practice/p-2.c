#include <stdio.h>

static int cut_rod(const int price[], int n, int first[])
{
    int dp[17] = {0};
    for (int length = 1; length <= n; length++) {
        dp[length] = -1000000;
        for (int cut = 1; cut <= length; cut++) {
            int candidate = price[cut - 1] + dp[length - cut];
            if (candidate > dp[length]) { dp[length] = candidate; first[length] = cut; }
        }
    }
    return dp[n];
}

int main(void)
{
    int n, price[16], first[17] = {0};
    puts("Enter length and prices:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &price[i]) != 1 || price[i] < -99 || price[i] > 99) { return 1; }
    }
    int revenue = cut_rod(price, n, first);

    printf("revenue = %d\ncuts:", revenue);
    while (n > 0) { printf(" %d", first[n]); n -= first[n]; }
    putchar('\n');
    return 0;
}
