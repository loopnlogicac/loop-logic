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
    int count = 0;
    for (int start = 0; start + m <= n;) {
        if (strncmp(text + start, pattern, (size_t)m) == 0) {
            count++;
            start += m;
        } else {
            start++;
        }
    }
    printf("Nonoverlapping count: %d\n", count);
    return 0;
}
