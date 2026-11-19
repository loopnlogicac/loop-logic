#include <stdio.h>
static int colour[4];
static const int edge[4][4] = {{0,1,1,0},{0,0,1,0},{1,0,0,1},{0,0,0,0}};
static void classify(int u)
{
    colour[u] = 1;
    for (int v = 0; v < 4; v++) {
        if (!edge[u][v]) { continue; }
        if (colour[v] == 0) {
            printf("%d->%d tree\n", u, v);
            classify(v);
        } else if (colour[v] == 1) {
            printf("%d->%d back\n", u, v);
        } else {
            printf("%d->%d finished\n", u, v);
        }
    }
    colour[u] = 2;
}
int main(void)
{
    classify(0);
    return 0;
}
