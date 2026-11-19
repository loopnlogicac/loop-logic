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

typedef struct { int value, vertex, parent; } Entry;
typedef struct { Entry a[32]; int count; } Heap;
static int before(Entry a, Entry b)
{
    return a.value < b.value || (a.value == b.value && a.vertex < b.vertex);
}
static void push(Heap *heap, Entry entry)
{
    int i = heap->count++;
    while (i > 0 && before(entry, heap->a[(i-1)/2])) {
        heap->a[i] = heap->a[(i-1)/2]; i = (i-1)/2;
    }
    heap->a[i] = entry;
}
static Entry pop(Heap *heap)
{
    Entry result = heap->a[0], last = heap->a[--heap->count];
    int i = 0;
    while (2*i+1 < heap->count) {
        int child = 2*i+1;
        if (child+1 < heap->count && before(heap->a[child+1], heap->a[child])) { child++; }
        if (!before(heap->a[child], last)) { break; }
        heap->a[i] = heap->a[child]; i = child;
    }
    if (heap->count > 0) { heap->a[i] = last; }
    return result;
}

static void solve(int scenario, int start)
{
    Graph g = make_graph(scenario, 0, 0);
    Heap heap = {0};
    int dist[N], parent[N], path[N];
    for (int u = 0; u < N; u++) { dist[u] = INF; parent[u] = -1; }
    dist[start] = 0;
    push(&heap, (Entry){0,start,-1});
    while (heap.count > 0) {
        Entry entry = pop(&heap);
        int u = entry.vertex;
        if (entry.value != dist[u]) { continue; }
        for (int k = 0; k < g.degree[u]; k++) {
            Arc a = g.adj[u][k];
            if (dist[u] + a.weight < dist[a.to]) {
                dist[a.to] = dist[u] + a.weight;
                parent[a.to] = u;
                push(&heap, (Entry){dist[a.to],a.to,u});
            }
        }
    }
    for (int u = 0; u < N; u++) {
        printf("%c %d\n", 'A'+u, dist[u] == INF ? -1 : dist[u]);
    }
    if (dist[5] == INF) { puts("no path to F"); return; }
    int count = 0;
    for (int v = 5; v != -1; v = parent[v]) { path[count++] = v; }
    for (int i = count-1; i >= 0; i--) {
        printf("%c%c", 'A'+path[i], i == 0 ? '\n' : ' ');
    }
}

int main(void)
{
    int scenario;
    puts("Enter graph (0-3); start is F:");
    if (scanf("%d", &scenario) != 1 || scenario < 0 || scenario > 3) { return 1; }
    solve(scenario, 5);
    return 0;
}
