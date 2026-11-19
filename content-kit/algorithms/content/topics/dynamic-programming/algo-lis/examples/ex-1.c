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
    int values[] = {3, 1, 2, 5, 4}, answer[16];
    int length = lis(values, 5, answer);

    printf("length = %d\n", length);
    for (int i = 0; i < length; i++) { printf("%s%d", i ? " " : "", answer[i]); }
    putchar('\n');
    return 0;
}
