#include <stdio.h>
#include <string.h>

static int edit_distance(const char a[], const char b[], int dp[17][17])
{
    int n = (int)strlen(a), m = (int)strlen(b);
    for (int i = 0; i <= n; i++) { dp[i][0] = i; }
    for (int j = 0; j <= m; j++) { dp[0][j] = j; }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            int best = dp[i - 1][j - 1] + (a[i - 1] != b[j - 1]);
            if (dp[i - 1][j] + 1 < best) { best = dp[i - 1][j] + 1; }
            if (dp[i][j - 1] + 1 < best) { best = dp[i][j - 1] + 1; }
            dp[i][j] = best;
        }
    }
    return dp[n][m];
}
static void operations(const char a[], const char b[], int dp[17][17], int i, int j)
{
    if (i == 0 && j == 0) { return; }
    if (i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + (a[i - 1] != b[j - 1])) {
        operations(a, b, dp, i - 1, j - 1);
        if (a[i - 1] != b[j - 1]) { printf("replace %c with %c\n", a[i - 1], b[j - 1]); }
    } else if (i > 0 && dp[i][j] == dp[i - 1][j] + 1) {
        operations(a, b, dp, i - 1, j);
        printf("delete %c\n", a[i - 1]);
    } else {
        operations(a, b, dp, i, j - 1);
        printf("insert %c\n", b[j - 1]);
    }
}

int main(void)
{
    const char *a = "CAT", *b = "CUT";
    int dp[17][17];
    printf("distance = %d\n", edit_distance(a, b, dp));
    operations(a, b, dp, (int)strlen(a), (int)strlen(b));
    return 0;
}
