#include <stdio.h>

static const int edge[5][5] = {
    {0, 1, 1, 0, 0}, {1, 0, 1, 0, 0}, {1, 1, 0, 1, 0},
    {0, 0, 1, 0, 1}, {0, 0, 0, 1, 0}
};
static int colors[5], m;
static int allowed(int v, int color)
{
    for (int u = 0; u < v; u++) {
        if (edge[v][u] && colors[u] == color) {
            return 0;
        }
    }
    return 1;
}
static int paint(int v)
{
    if (v == 5) {
        return 1;
    }
    for (int c = 1; c <= m; c++) {
        if (allowed(v, c)) {
            colors[v] = c;
            if (paint(v + 1)) {
                return 1;
            }
            colors[v] = 0;
        }
    }
    return 0;
}
int main(void)
{
    puts("Available exam slots (1..5):");
    if (scanf("%d", &m) != 1 || m < 1 || m > 5) {
        return 1;
    }
    if (!paint(0)) {
        puts("Impossible");
    } else {
        for (int v = 0; v < 5; v++) {
            printf("%c: %d\n", 'A' + v, colors[v]);
        }
    }
    return 0;
}
