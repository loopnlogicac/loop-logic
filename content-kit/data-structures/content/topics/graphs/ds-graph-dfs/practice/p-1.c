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
static void dfs(int adj[7][7], const int degree[7], int start)
{
    int seen[7] = {0}, stack[7], next[7] = {0}, top = 0, clock = 0;
    int enter[7] = {0}, leave[7] = {0};
    stack[0] = start; seen[start] = 1; enter[start] = ++clock;
    printf("discover: %d", start);
    while (top >= 0) {
        int u = stack[top];
        if (next[top] < degree[u]) {
            int v = adj[u][next[top]++];
            if (!seen[v]) {
                seen[v] = 1; enter[v] = ++clock;
                top++; stack[top] = v; next[top] = 0;
                printf(" %d", v);
            }
        } else {
            leave[u] = ++clock; top--;
        }
    }
    putchar('\n');
    for (int v = 0; v < 7; v++) { printf("%d enter=%d leave=%d\n", v, enter[v], leave[v]); }
}

int main(void)
{
    int adj[7][7], degree[7], graph, start;
    puts("DFS graph (0..3) and start (0..6):");
    if (scanf("%d%d", &graph, &start) != 2 || graph < 0 || graph > 3 ||
        start < 0 || start > 6) { return 1; }
    build_graph(graph, adj, degree); dfs(adj, degree, start);
    return 0;
}
