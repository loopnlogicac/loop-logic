#include <stdio.h>
#include <string.h>

static void prefix(const char *pattern, int m, int pi[24])
{
    pi[0] = 0;
    for (int i = 1; i < m; i++) {
        int j = pi[i - 1];
        while (j > 0 && pattern[i] != pattern[j]) {
            j = pi[j - 1];
        }
        if (pattern[i] == pattern[j]) {
            j++;
        }
        pi[i] = j;
    }
}
int main(void)
{
    char pattern[25];
    int pi[24];
    puts("Nonempty lowercase pattern (1..24 letters):");
    if (scanf("%24s", pattern) != 1) {
        return 1;
    }
    int m = (int)strlen(pattern);
    for (int i = 0; i < m; i++) {
        if (pattern[i] < 'a' || pattern[i] > 'z') {
            return 1;
        }
    }
    prefix(pattern, m, pi);
    for (int i = 0; i < m; i++) {
        printf("%d%s", pi[i], i + 1 == m ? "\n" : " ");
    }
    return 0;
}
