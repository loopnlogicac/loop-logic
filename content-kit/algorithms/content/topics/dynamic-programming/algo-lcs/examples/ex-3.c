#include <stdio.h>
#include <string.h>

static int lcs(const char a[], const char b[], char answer[])
{
    int n = (int)strlen(a), m = (int)strlen(b), dp[17][17] = {{0}};
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) { dp[i][j] = dp[i - 1][j - 1] + 1; }
            else { dp[i][j] = dp[i - 1][j] >= dp[i][j - 1] ?
                              dp[i - 1][j] : dp[i][j - 1]; }
        }
    }
    int i = n, j = m, k = dp[n][m];
    answer[k] = '\0';
    while (i > 0 && j > 0) {
        if (a[i - 1] == b[j - 1]) { answer[--k] = a[--i]; j--; }
        else if (dp[i - 1][j] >= dp[i][j - 1]) { i--; }
        else { j--; }
    }
    return dp[n][m];
}

int main(void)
{
    char answer[17];
    int length = lcs("", "ABC", answer);
    printf("length = %d\nsequence = %s\n", length, answer);
    return 0;
}
