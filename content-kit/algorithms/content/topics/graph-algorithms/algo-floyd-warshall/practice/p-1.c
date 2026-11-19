#include <stdio.h>
#define N 6
#define INF 1000000

typedef struct { int from, to, weight; } Edge;
typedef struct { int to, weight, id; } Arc;
typedef struct {
    Edge edges[12];
    Arc adj[N][N];
    int count, degree[N];
} Graph;

/* Scenario 0 is the shared six-node graph. */
static Graph make_graph(int scenario, int directed, int negative)
{
    Graph g = {0};
    const Edge base[] = {{0,1,4},{0,2,2},{1,2,1},{1,3,5},
                         {2,4,8},{3,4,2},{3,5,6},{4,5,3}};
    if (scenario == 1 && !negative) {
        for (int u = 0; u < N - 1; u++) {
            g.edges[g.count++] = (Edge){u, u + 1, 1};
        }
        if (directed) { g.edges[g.count++] = (Edge){5, 0, 1}; }
    } else if (scenario != 3) {
        for (int k = 0; k < 8; k++) {
            if (scenario == 2 && base[k].to == 5) { continue; }
            g.edges[g.count++] = base[k];
        }
        if (negative) {
            g.edges[2].weight = -3;
            if (scenario == 1) { g.edges[g.count++] = (Edge){4, 1, -6}; }
        }
    }
    /* Ascending neighbour order makes ties reproducible. */
    for (int u = 0; u < N; u++) {
        for (int v = 0; v < N; v++) {
            for (int k = 0; k < g.count; k++) {
                Edge e = g.edges[k];
                if ((e.from == u && e.to == v) ||
                    (!directed && e.to == u && e.from == v)) {
                    g.adj[u][g.degree[u]++] = (Arc){v, e.weight, k};
                }
            }
        }
    }
    return g;
}

static void solve(int scenario, int start)
{
    Graph g = make_graph(scenario, 1, 0);
    int dist[N][N], next[N][N];
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) { dist[i][j] = i == j ? 0 : INF; next[i][j] = -1; }
    }
    for (int k = 0; k < g.count; k++) {
        Edge e = g.edges[k]; dist[e.from][e.to] = e.weight; next[e.from][e.to] = e.to;
    }
    for (int k = 0; k < N; k++) {
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j]; next[i][j] = next[i][k];
                }
            }
        }
    }
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            printf("%d%c", dist[i][j] == INF ? -1 : dist[i][j], j+1 == N ? '\n' : ' ');
        }
    }
    int u = start;
    if (u != 5 && next[u][5] == -1) { puts("no path to F"); return; }
    printf("%c", 'A'+u);
    while (u != 5) { u = next[u][5]; printf(" %c", 'A'+u); }
    putchar('\n');
}

int main(void)
{
    int scenario, start;
    puts("Enter graph (0-3) and start (0-5):");
    if (scanf("%d%d", &scenario, &start) != 2 || scenario < 0 || scenario > 3 ||
        start < 0 || start >= N) { return 1; }
    solve(scenario, start);
    return 0;
}
