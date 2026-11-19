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

static void sort_edges(Edge edges[], int begin, int end)
{
    if (end-begin < 2) { return; }
    int middle = begin + (end-begin)/2;
    sort_edges(edges, begin, middle);
    sort_edges(edges, middle, end);
    Edge temp[12];
    int a = begin, b = middle, count = 0;
    while (a < middle && b < end) {
        temp[count++] = edges[a].weight <= edges[b].weight ? edges[a++] : edges[b++];
    }
    while (a < middle) { temp[count++] = edges[a++]; }
    while (b < end) { temp[count++] = edges[b++]; }
    for (int i = 0; i < count; i++) { edges[begin+i] = temp[i]; }
}

static int find(int parent[], int u)
{
    if (parent[u] != u) { parent[u] = find(parent, parent[u]); }
    return parent[u];
}
static void solve(int scenario, int start)
{
    Graph g = make_graph(scenario, 0, 0);
    int parent[N], size[N], total = 0, accepted = 0;
    (void)start;
    for (int u = 0; u < N; u++) { parent[u] = u; size[u] = 1; }
    sort_edges(g.edges, 0, g.count);
    for (int k = 0; k < g.count; k++) {
        Edge e = g.edges[k];
        int a = find(parent, e.from), b = find(parent, e.to);
        if (a == b) { continue; }
        if (size[a] < size[b]) { int temp = a; a = b; b = temp; }
        parent[b] = a; size[a] += size[b];
        total += e.weight; accepted++;
        printf("%c-%c %d\n", 'A'+e.from, 'A'+e.to, e.weight);
    }
    printf("weight %d components %d\n", total, N-accepted);
}

int main(void)
{
    solve(1, 0);
    return 0;
}
