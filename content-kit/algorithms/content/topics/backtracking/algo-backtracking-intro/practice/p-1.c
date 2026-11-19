#include <stdio.h>

static int n, ones, path[12];
static void explore(int pos, int used)
{
    if (used > ones || used + n - pos < ones) {
        return;
    }
    if (pos == n) {
        for (int i = 0; i < n; i++) {
            printf("%d", path[i]);
        }
        puts("");
        return;
    }
    for (int bit = 0; bit <= 1; bit++) {
        path[pos] = bit;
        explore(pos + 1, used + bit);
        path[pos] = 0; /* Restore the slot before another choice. */
    }
}
int main(void)
{
    puts("Length and required ones (0..12):");
    if (scanf("%d%d", &n, &ones) != 2 || n < 0 || n > 12 || ones < 0 || ones > n) {
        return 1;
    }
    explore(0, 0);
    return 0;
}
