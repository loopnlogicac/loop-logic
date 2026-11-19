#include <stdio.h>

static const int edge[5][5] = {
    {0, 1, 1, 0, 0}, {1, 0, 1, 0, 0}, {1, 1, 0, 1, 0},
    {0, 0, 1, 0, 1}, {0, 0, 0, 1, 0}
};
static int colors[5];
static int allowed(int v, int color)
{
    for (int u = 0; u < v; u++) {
        if (edge[v][u] && colors[u] == color) {
            return 0;
        }
    }
    return 1;
}

int main(void)
{
    int maximum = 0;
    for (int v = 0; v < 5; v++) {
        for (int c = 1; c <= 5; c++) {
            if (allowed(v, c)) {
                colors[v] = c;
                if (c > maximum) {
                    maximum = c;
                }
                break;
            }
        }
        printf("%c: %d\n", 'A' + v, colors[v]);
    }
    printf("Slots: %d\n", maximum);
    return 0;
}
