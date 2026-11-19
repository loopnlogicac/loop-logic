#include <stdio.h>
#include <stdlib.h>


int main(void)
{
    struct { int from; int to; int weight; } edges[] = {{0, 1, 0}, {1, 2, 8}};
    for (size_t i = 0; i < sizeof edges / sizeof edges[0]; i++) {
        printf("%d -> %d weight=%d\n", edges[i].from, edges[i].to, edges[i].weight);
    }
    return 0;
}
