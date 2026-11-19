#include <stdio.h>
#include <stdlib.h>

static int bucket(int key, int size)
{
    int r = key % size;
    return r < 0 ? r + size : r;
}
typedef struct Node {
    int key;
    struct Node *next;
} Node;
static int insert(Node **table, int key)
{
    int index = bucket(key, 7);
    Node **link = &table[index];
    while (*link != NULL) {
        if ((*link)->key == key) { return 0; }
        link = &(*link)->next;
    }
    Node *node = malloc(sizeof *node);
    if (node == NULL) { return -1; }
    *node = (Node){key, NULL};
    *link = node;
    return 1;
}
static void clear(Node **table)
{
    for (int i = 0; i < 7; i++) {
        while (table[i] != NULL) {
            Node *old = table[i];
            table[i] = old->next;
            free(old);
        }
    }
}

int main(void)
{
    Node *table[7] = {NULL};
    int n, count = 0, longest = 0;
    puts("Count and keys for chain lengths:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) { return 1; }
    for (int i = 0; i < n; i++) {
        int key, status;
        if (scanf("%d", &key) != 1) { clear(table); return 1; }
        status = insert(table, key);
        if (status < 0) { clear(table); return 1; }
        count += status;
    }
    for (int i = 0; i < 7; i++) {
        int length = 0;
        for (Node *cur = table[i]; cur != NULL; cur = cur->next) { length++; }
        if (length > longest) { longest = length; }
    }
    printf("keys=%d load=%.3f longest=%d\n", count, count / 7.0, longest);
    clear(table);
    return 0;
}
