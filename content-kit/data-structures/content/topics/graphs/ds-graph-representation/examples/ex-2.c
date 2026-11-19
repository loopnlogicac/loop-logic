#include <stdio.h>
#include <stdlib.h>

typedef struct Edge { int to; struct Edge *next; } Edge;
static void release(Edge **head, int n)
{
    for (int u = 0; u < n; u++) {
        while (head[u] != NULL) {
            Edge *old = head[u]; head[u] = old->next; free(old);
        }
    }
}
static int connect(Edge **head, int u, int v)
{
    Edge *a = malloc(sizeof *a), *b = malloc(sizeof *b);
    if (a == NULL || b == NULL) { free(a); free(b); return 0; }
    *a = (Edge){v, head[u]}; *b = (Edge){u, head[v]};
    head[u] = a; head[v] = b;
    return 1;
}

int main(void)
{
    Edge *head[8] = {NULL};
    int n, m, seen[8][8] = {{0}};
    puts("Lists: vertices, edges and pairs:");
    if (scanf("%d%d", &n, &m) != 2 || n < 0 || n > 8 || m < 0 || m > 28) { return 1; }
    for (int i = 0; i < m; i++) {
        int u, v;
        if (scanf("%d%d", &u, &v) != 2 || u < 0 || v < 0 || u >= n || v >= n ||
            u == v || seen[u][v]) { release(head, n); return 1; }
        if (!connect(head, u, v)) { release(head, n); return 1; }
        seen[u][v] = seen[v][u] = 1;
    }
    for (int u = 0; u < n; u++) {
        printf("%d:", u);
        for (Edge *cur = head[u]; cur != NULL; cur = cur->next) { printf(" %d", cur->to); }
        putchar('\n');
    }
    release(head, n);
    return 0;
}
