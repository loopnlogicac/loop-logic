#include <stdio.h>
#include <stdlib.h>

static void build_graph(int graph, int adj[7][7], int degree[7])
{
    const int pairs[7][2] = {{0,1},{0,2},{1,3},{1,4},{2,4},{3,5},{4,5}};
    int matrix[7][7] = {{0}};
    if (graph == 0) {
        for (int i = 0; i < 7; i++) {
            int u = pairs[i][0], v = pairs[i][1]; matrix[u][v] = matrix[v][u] = 1;
        }
    } else if (graph == 1) {
        for (int i = 0; i < 6; i++) { matrix[i][i+1] = matrix[i+1][i] = 1; }
    } else if (graph == 3) {
        for (int u = 0; u < 7; u++) {
            for (int v = 0; v < 7; v++) { matrix[u][v] = u != v; }
        }
    }
    for (int u = 0; u < 7; u++) {
        degree[u] = 0;
        for (int v = 0; v < 7; v++) {
            if (matrix[u][v]) { adj[u][degree[u]++] = v; }
        }
    }
}
static void visit(int adj[7][7], const int degree[7], int u, int seen[7])
{
    seen[u] = 1;
    printf("enter %d\n", u);
    for (int j = 0; j < degree[u]; j++) {
        int v = adj[u][j];
        if (!seen[v]) { visit(adj, degree, v, seen); }
    }
    printf("leave %d\n", u);
}

int main(void)
{
    int adj[7][7], degree[7], seen[7] = {0}, graph, components = 0;
    puts("Forest graph (0..3):");
    if (scanf("%d", &graph) != 1 || graph < 0 || graph > 3) { return 1; }
    build_graph(graph, adj, degree);
    for (int u = 0; u < 7; u++) {
        if (!seen[u]) { components++; visit(adj, degree, u, seen); }
    }
    printf("components=%d\n", components);
    return 0;
}
