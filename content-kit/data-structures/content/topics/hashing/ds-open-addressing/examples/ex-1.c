#include <stdio.h>
#include <stdlib.h>

static int bucket(int key, int size)
{
    int r = key % size;
    return r < 0 ? r + size : r;
}
typedef struct { int key; int state; } Slot;
static int probe(int key, int method, int attempt)
{
    int offset = attempt;
    if (method == 1) { offset = attempt * attempt; }
    if (method == 2) { offset = attempt * (1 + bucket(key, 10)); }
    return (bucket(key, 11) + offset) % 11;
}
static int locate(Slot *table, int key, int method)
{
    for (int attempt = 0; attempt < 11; attempt++) {
        int index = probe(key, method, attempt);
        if (table[index].state == 0) { return -1; }
        if (table[index].state == 1 && table[index].key == key) { return index; }
    }
    return -1;
}
static int insert(Slot *table, int key, int method)
{
    int first = -1;
    for (int attempt = 0; attempt < 11; attempt++) {
        int index = probe(key, method, attempt);
        if (table[index].state == 1 && table[index].key == key) { return 0; }
        if (table[index].state == 2 && first < 0) { first = index; }
        if (table[index].state == 0) {
            if (first < 0) { first = index; }
            break;
        }
    }
    if (first < 0) { return -1; }
    table[first] = (Slot){key, 1};
    return 1;
}

int main(void)
{
    Slot table[11] = {{0, 0}};
    int n, method, keys[12], removed, query;
    puts("Count, keys, method (0..2), delete key and query:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &keys[i]) != 1) { return 1; }
    }
    if (scanf("%d%d%d", &method, &removed, &query) != 3 ||
        method < 0 || method > 2) { return 1; }
    for (int i = 0; i < n; i++) {
        printf("insert %d=%d\n", keys[i], insert(table, keys[i], method));
    }
    int index = locate(table, removed, method);
    if (index >= 0) { table[index].state = 2; }
    printf("removed=%d found=%d\n", index >= 0, locate(table, query, method) >= 0);
    for (int i = 0; i < 11; i++) {
        printf("%d:", i);
        if (table[i].state == 1) { printf(" %d", table[i].key); }
        if (table[i].state == 2) { printf(" tombstone"); }
        putchar('\n');
    }
    return 0;
}
