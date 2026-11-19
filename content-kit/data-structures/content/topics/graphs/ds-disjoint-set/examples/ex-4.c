#include <stdio.h>
#include <stdlib.h>

static int build_pairs(int graph, int pairs[21][2])
{
    int count = 0;
    const int diamond[7][2] = {{0,1},{0,2},{1,3},{1,4},{2,4},{3,5},{4,5}};
    const int balanced[6][2] = {{0,1},{2,3},{0,2},{4,5},{4,6},{0,4}};
    if (graph == 0) {
        for (int i = 0; i < 7; i++) {
            pairs[count][0] = diamond[i][0]; pairs[count++][1] = diamond[i][1];
        }
    } else if (graph == 1) {
        for (int i = 0; i < 6; i++) { pairs[count][0] = i; pairs[count++][1] = i + 1; }
    } else if (graph == 3) {
        for (int u = 0; u < 7; u++) {
            for (int v = u + 1; v < 7; v++) { pairs[count][0] = u; pairs[count++][1] = v; }
        }
    } else if (graph == 4) {
        for (int i = 0; i < 6; i++) {
            pairs[count][0] = balanced[i][0]; pairs[count++][1] = balanced[i][1];
        }
    }
    return count;
}
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
    int pairs[21][2], parent[7], size[7], graph, query, components = 7;
    puts("Union graph (0..4) and query (0..6):");
    if (scanf("%d%d", &graph, &query) != 2 || graph < 0 || graph > 4 ||
        query < 0 || query > 6) { return 1; }
    int count = build_pairs(graph, pairs);
    for (int i = 0; i < 7; i++) { parent[i] = i; size[i] = 1; }
    for (int i = 0; i < count; i++) {
        components -= unite(parent, size, pairs[i][0], pairs[i][1]);
    }
    int root = find(parent, query);
    printf("root=%d size=%d components=%d\n", root, size[root], components);
    printf("parents:");
    for (int i = 0; i < 7; i++) { printf(" %d", parent[i]); }
    putchar('\n');
    return 0;
}
