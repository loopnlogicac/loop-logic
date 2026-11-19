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
    char a[17], b[17];
    puts("Enter two strings (- means empty):");
    if (scanf("%16s%16s", a, b) != 2) { return 1; }
    if (strcmp(a, "-") == 0) { a[0] = '\0'; }
    if (strcmp(b, "-") == 0) { b[0] = '\0'; }
    char answer[17];
    int length = lcs(a, b, answer);
    printf("deletions = %d\n", (int)strlen(a) + (int)strlen(b) - 2 * length);
    return 0;
}
