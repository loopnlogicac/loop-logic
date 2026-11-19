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
static void bfs(int adj[7][7], const int degree[7], int start,
                int dist[7], int parent[7])
{
    int queue[7], head = 0, tail = 0;
    for (int i = 0; i < 7; i++) { dist[i] = parent[i] = -1; }
    dist[start] = 0; queue[tail++] = start;
    printf("order:");
    while (head < tail) {
        int u = queue[head++];
        printf(" %d", u);
        for (int j = 0; j < degree[u]; j++) {
            int v = adj[u][j];
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1; parent[v] = u; queue[tail++] = v;
            }
        }
    }
    putchar('\n');
}

int main(void)
{
    int adj[7][7], degree[7], dist[7], parent[7], graph, start;
    puts("Graph (0..3) and start (0..6):");
    if (scanf("%d%d", &graph, &start) != 2 || graph < 0 || graph > 3 ||
        start < 0 || start > 6) { return 1; }
    build_graph(graph, adj, degree);
    bfs(adj, degree, start, dist, parent);
    for (int v = 0; v < 7; v++) {
        printf("%d distance=%d parent=%d\n", v, dist[v], parent[v]);
    }
    return 0;
}
