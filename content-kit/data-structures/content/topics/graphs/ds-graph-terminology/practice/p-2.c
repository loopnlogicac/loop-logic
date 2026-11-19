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
static int color_component(int a[8][8], int n, int start, int color[8])
{
    int queue[8], head = 0, tail = 0;
    queue[tail++] = start;
    color[start] = 0;
    while (head < tail) {
        int u = queue[head++];
        for (int v = 0; v < n; v++) {
            if (!a[u][v]) { continue; }
            if (color[v] == -1) {
                color[v] = 1 - color[u];
                queue[tail++] = v;
            } else if (color[v] == color[u]) { return 0; }
        }
    }
    return 1;
}

int main(void)
{
    int a[8][8] = {{0}}, n, m, color[8], good = 1;
    puts("Vertices, edges and pairs for two colors:");
    if (!read_graph(a, &n, &m)) { return 1; }
    for (int i = 0; i < n; i++) { color[i] = -1; }
    for (int u = 0; u < n && good; u++) {
        if (color[u] == -1) { good = color_component(a, n, u, color); }
    }
    printf("bipartite=%d\n", good);
    return 0;
}
