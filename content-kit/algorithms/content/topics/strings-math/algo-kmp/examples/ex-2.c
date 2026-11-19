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
    char text[25], pattern[25];
    puts("Text and nonempty pattern (1..24 lowercase letters each):");
    if (scanf("%24s%24s", text, pattern) != 2) {
        return 1;
    }
    for (int k = 0; k < 2; k++) {
        const char *word = k == 0 ? text : pattern;
        for (int i = 0; word[i]; i++) {
            if (word[i] < 'a' || word[i] > 'z') {
                return 1;
            }
        }
    }
    int n = (int)strlen(text), m = (int)strlen(pattern);
    int pi[24], j = 0, count = 0;
    prefix(pattern, m, pi);
    for (int i = 0; i < n; i++) {
        while (j > 0 && text[i] != pattern[j]) {
            j = pi[j - 1];
        }
        if (text[i] == pattern[j]) {
            j++;
        }
        if (j == m) {
            printf("Match: %d\n", i - m + 1);
            count++;
            j = pi[j - 1];
        }
    }
    printf("Count: %d\n", count);
    return 0;
}
