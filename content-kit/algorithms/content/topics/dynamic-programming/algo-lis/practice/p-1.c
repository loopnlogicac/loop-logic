#include <stdio.h>

static int lis(const int values[], int n, int answer[])
{
    if (n == 0) { return 0; }
    int dp[16], previous[16], best = 0;
    for (int i = 0; i < n; i++) {
        dp[i] = 1; previous[i] = -1;
        for (int j = 0; j < i; j++) {
            if (values[j] < values[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1; previous[i] = j;
            }
        }
        if (dp[i] > dp[best]) { best = i; }
    }
    int length = dp[best], at = best;
    for (int k = length - 1; k >= 0; k--) { answer[k] = values[at]; at = previous[at]; }
    return length;
}

int main(void)
{
    int n, values[16];
    puts("Enter n and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -99 || values[i] > 99) { return 1; }
    }
    int answer[16];
    int length = lis(values, n, answer);

    printf("length = %d\n", length);
    for (int i = 0; i < length; i++) { printf("%s%d", i ? " " : "", answer[i]); }
    putchar('\n');
    return 0;
}
