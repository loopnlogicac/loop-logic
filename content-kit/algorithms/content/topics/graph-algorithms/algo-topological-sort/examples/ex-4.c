#include <stdio.h>
static const int a[4][4] = {{0,1,1,0},{0,0,0,1},{0,0,0,1},{0,0,0,0}};
static int colour[4], order[4], count;
static int visit(int u)
{
    colour[u] = 1;
    for (int v = 0; v < 4; v++) {
        if (!a[u][v]) { continue; }
        if (colour[v] == 1) { return 0; }
        if (colour[v] == 0 && !visit(v)) { return 0; }
    }
    colour[u] = 2;
    order[count++] = u;
    return 1;
}
int main(void)
{
    for (int u = 0; u < 4; u++) {
        if (colour[u] == 0 && !visit(u)) { puts("cycle"); return 0; }
    }
    for (int i = count-1; i >= 0; i--) { printf("%d%c", order[i], i == 0 ? '\n' : ' '); }
    return 0;
}
