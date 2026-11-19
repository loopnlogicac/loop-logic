#include <stdio.h>

static void build(int n, int pos, unsigned prefix)
{
    if (pos == n) {
        printf("%u\n", prefix);
        return;
    }
    build(n, pos + 1, prefix * 2);
    build(n, pos + 1, prefix * 2 + 1);
}
int main(void)
{
    int n;
    puts("Prefix length (0..8):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 8) {
        return 1;
    }
    build(n, 0, 0);
    return 0;
}
