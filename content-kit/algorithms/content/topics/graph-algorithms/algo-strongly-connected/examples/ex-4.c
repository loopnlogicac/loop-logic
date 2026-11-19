#include <stdio.h>
#define N 6
static const int a[N][N] = {{0,1,0,0,0,0},{1,0,1,0,0,0},
                           {0,0,0,1,0,0},{0,0,1,0,1,0},
                           {0,0,0,0,0,1},{0,0,0,0,0,0}};
static int seen[N], order[N], count, comp[N];
static void finish(int u)
{
    seen[u] = 1;
    for (int v = 0; v < N; v++) { if (a[u][v] && !seen[v]) { finish(v); } }
    order[count++] = u;
}
static void assign(int u, int id)
{
    comp[u] = id;
    for (int v = 0; v < N; v++) { if (a[v][u] && comp[v] == -1) { assign(v, id); } }
}
int main(void)
{
    int components = 0, dag[N][N] = {{0}};
    for (int u = 0; u < N; u++) { comp[u] = -1; if (!seen[u]) { finish(u); } }
    for (int i = count-1; i >= 0; i--) {
        if (comp[order[i]] == -1) { assign(order[i], components++); }
    }
    for (int u = 0; u < N; u++) { printf("%d %d\n", u, comp[u]); }
    for (int u = 0; u < N; u++) {
        for (int v = 0; v < N; v++) {
            if (a[u][v] && comp[u] != comp[v]) { dag[comp[u]][comp[v]] = 1; }
        }
    }
    for (int a = 0; a < components; a++) {
        for (int b = 0; b < components; b++) { if (dag[a][b]) { printf("%d -> %d\n", a,b); } }
    }
    return 0;
}
