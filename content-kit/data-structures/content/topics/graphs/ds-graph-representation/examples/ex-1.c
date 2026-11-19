#include <stdio.h>
#include <stdlib.h>

static int read_graph(int a[8][8], int *n, int *m)
{
    if (scanf("%d%d", n, m) != 2 || *n < 0 || *n > 8 || *m < 0 || *m > 28) {
        return 0;
    }
    for (int i = 0; i < *m; i++) {
        int u, v;
        if (scanf("%d%d", &u, &v) != 2 || u < 0 || v < 0 || u >= *n || v >= *n ||
            u == v || a[u][v]) { return 0; }
        a[u][v] = a[v][u] = 1;
    }
    return 1;
}

int main(void)
{
    int a[8][8] = {{0}}, n, m;
    puts("Matrix: vertices, edges and pairs:");
    if (!read_graph(a, &n, &m)) { return 1; }
    for (int u = 0; u < n; u++) {
        for (int v = 0; v < n; v++) { printf("%s%d", v == 0 ? "" : " ", a[u][v]); }
        putchar('\n');
    }
    return 0;
}
