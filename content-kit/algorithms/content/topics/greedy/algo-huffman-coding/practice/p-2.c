#include <stdio.h>

typedef struct { int weight, left, right; } Node;
static Node nodes[31];
static int heap[31], size;
static int less(int a, int b)
{
    return nodes[a].weight < nodes[b].weight ||
           (nodes[a].weight == nodes[b].weight && a < b);
}
static void push(int id)
{
    int i = size++;
    while (i > 0 && less(id, heap[(i - 1) / 2])) {
        heap[i] = heap[(i - 1) / 2];
        i = (i - 1) / 2;
    }
    heap[i] = id;
}
static int pop(void)
{
    int result = heap[0], last = heap[--size], i = 0;
    while (2 * i + 1 < size) {
        int child = 2 * i + 1;
        if (child + 1 < size && less(heap[child + 1], heap[child])) { child++; }
        if (!less(heap[child], last)) { break; }
        heap[i] = heap[child];
        i = child;
    }
    heap[i] = last;
    return result;
}
static int build(const int frequencies[], int n)
{
    size = 0;
    for (int i = 0; i < n; i++) {
        nodes[i] = (Node){frequencies[i], -1, -1};
        push(i);
    }
    int next = n;
    while (size > 1) {
        int left = pop(), right = pop();
        nodes[next] = (Node){nodes[left].weight + nodes[right].weight, left, right};
        push(next++);
    }
    return pop();
}
static void codes(int root, char path[], int depth)
{
    if (nodes[root].left == -1) {
        path[depth] = '\0';
        printf("%c %s\n", 'A' + root, depth == 0 ? "0" : path);
        return;
    }
    path[depth] = '0'; codes(nodes[root].left, path, depth + 1);
    path[depth] = '1'; codes(nodes[root].right, path, depth + 1);
}

static int bits(int root, int depth)
{
    if (nodes[root].left == -1) { return nodes[root].weight * (depth ? depth : 1); }
    return bits(nodes[root].left, depth + 1) + bits(nodes[root].right, depth + 1);
}

int main(void)
{
    int n, frequencies[16];
    char path[32];
    puts("Enter symbol count and positive frequencies:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &frequencies[i]) != 1 || frequencies[i] < 1 ||
            frequencies[i] > 99) { return 1; }
    }
    int root = build(frequencies, n);
    codes(root, path, 0);
    printf("bits = %d\n", bits(root, 0));
    return 0;
}
