#include <stdio.h>
#include <stdlib.h>


int main(void)
{
    int a[4][4] = {{0, 1, 1, 0}, {0, 0, 0, 1}, {0, 0, 0, 1}, {0, 0, 0, 0}};
    for (int u = 0; u < 4; u++) {
        int in = 0, out = 0;
        for (int v = 0; v < 4; v++) { in += a[v][u]; out += a[u][v]; }
        printf("%d in=%d out=%d\n", u, in, out);
    }
    return 0;
}
