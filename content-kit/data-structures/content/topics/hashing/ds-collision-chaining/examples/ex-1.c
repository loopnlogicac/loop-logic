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
static int erase(Node **table, int key)
{
    Node **link = &table[bucket(key, 7)];
    while (*link != NULL && (*link)->key != key) { link = &(*link)->next; }
    if (*link == NULL) { return 0; }
    Node *old = *link;
    *link = old->next;
    free(old);
    return 1;
}
static int search(Node **table, int key)
{
    for (Node *cur = table[bucket(key, 7)]; cur != NULL; cur = cur->next) {
        if (cur->key == key) { return 1; }
    }
    return 0;
}

int main(void)
{
    Node *table[7] = {NULL};
    int n, removed, query;
    puts("Count, keys, delete key and query:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) { return 1; }
    for (int i = 0; i < n; i++) {
        int key;
        if (scanf("%d", &key) != 1 || insert(table, key) < 0) {
            clear(table); return 1;
        }
    }
    if (scanf("%d%d", &removed, &query) != 2) { clear(table); return 1; }
    printf("removed=%d\n", erase(table, removed));
    printf("found=%d\n", search(table, query));
    for (int i = 0; i < 7; i++) {
        printf("%d:", i);
        for (Node *cur = table[i]; cur != NULL; cur = cur->next) {
            printf(" %d", cur->key);
        }
        putchar('\n');
    }
    clear(table);
    return 0;
}
