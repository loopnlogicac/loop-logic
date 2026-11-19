#include <stdio.h>
#include <stdlib.h>

static int find(int parent[], int u)
{
    int root = u;
    while (parent[root] != root) { root = parent[root]; }
    while (parent[u] != u) {
        int next = parent[u]; parent[u] = root; u = next;
    }
    return root;
}

int main(void)
{
    int parent[] = {0, 0, 1, 2, 3};
    printf("before:");
    for (int i = 0; i < 5; i++) { printf(" %d", parent[i]); }
    printf("\nroot=%d\n", find(parent, 4));
    printf("after:");
    for (int i = 0; i < 5; i++) { printf(" %d", parent[i]); }
    putchar('\n');
    return 0;
}
