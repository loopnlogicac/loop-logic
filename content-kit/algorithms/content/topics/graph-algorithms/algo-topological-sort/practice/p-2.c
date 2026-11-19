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
    int indegree[N] = {0}, queue[N], head = 0, tail = 0, order[N], count = 0;
    (void)start;
    for (int k = 0; k < g.count; k++) { indegree[g.edges[k].to]++; }
    for (int u = 0; u < N; u++) { if (indegree[u] == 0) { queue[tail++] = u; } }
    while (head < tail) {
        int u = queue[head++];
        order[count++] = u;
        for (int k = 0; k < g.degree[u]; k++) {
            int v = g.adj[u][k].to;
            if (--indegree[v] == 0) { queue[tail++] = v; }
        }
    }
    if (count != N) { puts("cycle"); return; }
    int rank[N];
    for (int i = 0; i < N; i++) { rank[order[i]] = i; }
    for (int u = 0; u < N; u++) { printf("%c %d\n", 'A'+u, rank[u]); }
}

int main(void)
{
    int scenario;
    puts("Enter graph (0-3):");
    if (scanf("%d", &scenario) != 1 || scenario < 0 || scenario > 3) { return 1; }
    solve(scenario, 5);
    return 0;
}
