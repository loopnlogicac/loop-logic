#include <stdio.h>
#include <string.h>

static char text[9], result[9];
static int used[8], n;
static void generate(int pos)
{
    if (pos == n) {
        result[n] = '\0';
        puts(result);
        return;
    }
    for (int i = 0; i < n; i++) {
        if (used[i] || (i > 0 && text[i] == text[i - 1] && !used[i - 1])) {
            continue;
        }
        used[i] = 1;
        result[pos] = text[i];
        generate(pos + 1);
        used[i] = 0;
    }
}
int main(void)
{
    puts("Word (1..8 lowercase letters):");
    if (scanf("%8s", text) != 1) {
        return 1;
    }
    n = (int)strlen(text);
    for (int i = 0; i < n; i++) {
        if (text[i] < 'a' || text[i] > 'z') {
            return 1;
        }
        for (int j = i; j > 0 && text[j] < text[j - 1]; j--) {
            char tmp = text[j];
            text[j] = text[j - 1];
            text[j - 1] = tmp;
        }
    }
    generate(0);
    return 0;
}
