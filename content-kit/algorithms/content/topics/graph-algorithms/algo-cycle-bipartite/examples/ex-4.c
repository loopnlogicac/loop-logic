#include <stdio.h>
static const int edge[4][4] = {{0,1,1,0},{0,0,0,1},{0,0,0,1},{0,0,0,0}};
static int colour[4];
static int cyclic(int u)
{
    colour[u] = 1;
    for (int v = 0; v < 4; v++) {
        if (!edge[u][v]) { continue; }
        if (colour[v] == 1) { return 1; }
        if (colour[v] == 0 && cyclic(v)) { return 1; }
    }
    colour[u] = 2;
    return 0;
}
int main(void)
{
    int cycle = 0;
    for (int u = 0; u < 4; u++) {
        if (!colour[u] && cyclic(u)) { cycle = 1; break; }
    }
    printf("%d\n", cycle);
    return 0;
}
