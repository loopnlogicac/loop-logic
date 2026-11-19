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
    (void)insert(table, 1, 0); (void)insert(table, 12, 0); (void)insert(table, 23, 0);
    table[locate(table, 12, 0)].state = 2;
    printf("duplicate=%d\n", insert(table, 23, 0));
    printf("new=%d\n", insert(table, 34, 0));
    printf("slot2=%d found23=%d\n", table[2].key, locate(table, 23, 0) >= 0);
    return 0;
}
