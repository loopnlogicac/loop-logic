#include <stdio.h>


int main(void)
{
    const int edge[3][3] = {{0, 1, 1}, {1, 0, 1}, {1, 1, 0}};
    const int color[3] = {1, 2, 3};
    int valid = 1;
    for (int u = 0; u < 3; u++) {
        if (color[u] < 1 || color[u] > 3) {
            valid = 0;
        }
        for (int v = u + 1; v < 3; v++) {
            if (edge[u][v] && color[u] == color[v]) {
                valid = 0;
            }
        }
    }
    puts(valid ? "Certificate accepted" : "Certificate rejected");
    return 0;
}
