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
    int price[] = {1, 5, 8, 9}, first[17] = {0}, length = 4;
    printf("revenue = %d\n", cut_rod(price, length, first));
    printf("cuts:");
    while (length > 0) { printf(" %d", first[length]); length -= first[length]; }
    putchar('\n');
    return 0;
}
