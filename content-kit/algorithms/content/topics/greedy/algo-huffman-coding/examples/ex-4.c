#include <stdio.h>
#include <string.h>

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

static void save_codes(int root, char path[], int depth, char book[16][32])
{
    if (nodes[root].left == -1) {
        path[depth] = '\0';
        strcpy(book[root], depth == 0 ? "0" : path);
        return;
    }
    path[depth] = '0'; save_codes(nodes[root].left, path, depth + 1, book);
    path[depth] = '1'; save_codes(nodes[root].right, path, depth + 1, book);
}
static int decode(int root, const char bits[])
{
    int at = root;
    if (nodes[root].left == -1) {
        for (int i = 0; bits[i] != '\0'; i++) {
            if (bits[i] != '0') { return 0; }
            putchar('A' + root);
        }
        putchar('\n');
        return 1;
    }
    for (int i = 0; bits[i] != '\0'; i++) {
        if (bits[i] == '0') { at = nodes[at].left; }
        else if (bits[i] == '1') { at = nodes[at].right; }
        else { return 0; }
        if (at == -1) { return 0; }
        if (nodes[at].left == -1) { putchar('A' + at); at = root; }
    }
    putchar('\n');
    return at == root;
}

int main(void)
{
    int frequencies[] = {5, 9, 12, 13, 16, 45};
    char path[32], book[16][32] = {{0}}, encoded[128] = "";
    const char *message = "FACE";
    int root = build(frequencies, 6);
    codes(root, path, 0);
    save_codes(root, path, 0, book);
    for (int i = 0; message[i] != '\0'; i++) {
        strcat(encoded, book[message[i] - 'A']);
    }
    printf("encoded = %s\ndecoded = ", encoded);
    if (!decode(root, encoded)) { return 1; }
    return 0;
}
