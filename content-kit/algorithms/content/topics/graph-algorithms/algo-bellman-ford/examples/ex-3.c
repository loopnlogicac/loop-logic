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
    Graph g = make_graph(scenario, 1, 1);
    int dist[N], affected[N] = {0};
    for (int u = 0; u < N; u++) { dist[u] = INF; }
    dist[start] = 0;
    for (int pass = 1; pass < N; pass++) {
        int changed = 0;
        for (int k = 0; k < g.count; k++) {
            Edge e = g.edges[k];
            if (dist[e.from] != INF && dist[e.from] + e.weight < dist[e.to]) {
                dist[e.to] = dist[e.from] + e.weight;
                changed = 1;
            }
        }
        if (!changed) { break; }
    }
    for (int k = 0; k < g.count; k++) {
        Edge e = g.edges[k];
        if (dist[e.from] != INF && dist[e.from] + e.weight < dist[e.to]) {
            affected[e.to] = 1;
        }
    }
    for (int pass = 0; pass < N; pass++) {
        for (int k = 0; k < g.count; k++) {
            Edge e = g.edges[k];
            if (affected[e.from]) { affected[e.to] = 1; }
        }
    }
    for (int u = 0; u < N; u++) {
        if (affected[u]) { printf("%c -INF\n", 'A'+u); }
        else if (dist[u] == INF) { printf("%c INF\n", 'A'+u); }
        else { printf("%c %d\n", 'A'+u, dist[u]); }
    }
}

int main(void)
{
    solve(2, 0);
    return 0;
}
