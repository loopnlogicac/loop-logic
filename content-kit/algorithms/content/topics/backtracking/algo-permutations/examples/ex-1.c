#include <stdio.h>
#include <string.h>

static char text[9];
static void swap(char *a, char *b)
{
    char tmp = *a;
    *a = *b;
    *b = tmp;
}
static void permute(int pos, int n)
{
    if (pos == n) {
        puts(text);
        return;
    }
    int seen[256] = {0};
    for (int i = pos; i < n; i++) {
        unsigned char ch = (unsigned char)text[i];
        if (!seen[ch]) {
            seen[ch] = 1;
            swap(&text[pos], &text[i]);
            permute(pos + 1, n);
            swap(&text[pos], &text[i]);
        }
    }
}
int main(void)
{
    puts("Word (1..8 lowercase letters):");
    if (scanf("%8s", text) != 1) {
        return 1;
    }
    for (int i = 0; text[i]; i++) {
        if (text[i] < 'a' || text[i] > 'z') {
            return 1;
        }
    }
    permute(0, (int)strlen(text));
    return 0;
}
