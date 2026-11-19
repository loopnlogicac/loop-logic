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
static int unite(int parent[], int size[], int u, int v)
{
    int a = find(parent, u), b = find(parent, v);
    if (a == b) { return 0; }
    if (size[a] < size[b]) { int temp = a; a = b; b = temp; }
    parent[b] = a; size[a] += size[b];
    return 1;
}

int main(void)
{
    int parent[12], size[12], n, m, components;
    puts("Vertices, pair count and union pairs:");
    if (scanf("%d%d", &n, &m) != 2 || n < 0 || n > 12 || m < 0 || m > 20) { return 1; }
    components = n;
    for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    for (int i = 0; i < m; i++) {
        int u, v;
        if (scanf("%d%d", &u, &v) != 2 || u < 0 || v < 0 || u >= n || v >= n) { return 1; }
        components -= unite(parent, size, u, v);
    }
    printf("components=%d\n", components);
    for (int i = 0; i < n; i++) { printf("%d root=%d\n", i, find(parent, i)); }
    return 0;
}
