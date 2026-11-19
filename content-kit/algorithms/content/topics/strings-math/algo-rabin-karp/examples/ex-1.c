#include <stdio.h>
#include <string.h>


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
    const int base = 26, mod = 101;
    int high = 1, wanted = 0, window = 0, count = 0, hits = 0;
    if (m > n) {
        puts("Hash hits: 0\nCount: 0");
        return 0;
    }
    for (int k = 1; k < m; k++) {
        high = high * base % mod;
    }
    for (int k = 0; k < m; k++) {
        wanted = (wanted * base + pattern[k] - 'a') % mod;
        window = (window * base + text[k] - 'a') % mod;
    }
    for (int start = 0; start + m <= n; start++) {
        if (window == wanted) {
            hits++;
            if (strncmp(text + start, pattern, (size_t)m) == 0) {
                printf("Match: %d\n", start);
                count++;
            }
        }
        if (start + m < n) {
            window = (window - (text[start] - 'a') * high % mod + mod) % mod;
            window = (window * base + text[start + m] - 'a') % mod;
        }
    }
    printf("Hash hits: %d\nCount: %d\n", hits, count);
    return 0;
}
