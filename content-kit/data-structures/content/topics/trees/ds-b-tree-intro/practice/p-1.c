#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct BNode {
    int count, leaf, key[3], child[4];
} BNode;
BNode nodes[32];
int used = 0;
int make_node(int leaf)
{
    int id = used++;
    nodes[id] = (BNode){0};
    nodes[id].leaf = leaf;
    return id;
}
void split_child(int parent, int index)
{
    BNode *p = &nodes[parent];
    int old = p->child[index];
    int sibling = make_node(nodes[old].leaf);
    BNode *left = &nodes[old], *right = &nodes[sibling];
    right->count = 1;
    right->key[0] = left->key[2];
    if (!left->leaf) {
        right->child[0] = left->child[2];
        right->child[1] = left->child[3];
    }
    int middle = left->key[1];
    left->count = 1;
    for (int j = p->count; j > index; j--) {
        p->child[j + 1] = p->child[j];
    }
    p->child[index + 1] = sibling;
    for (int j = p->count - 1; j >= index; j--) {
        p->key[j + 1] = p->key[j];
    }
    p->key[index] = middle;
    p->count++;
}
int contains(int root, int key)
{
    BNode *p = &nodes[root];
    int i = 0;
    while (i < p->count && key > p->key[i]) {
        i++;
    }
    if (i < p->count && key == p->key[i]) {
        return 1;
    }
    return p->leaf ? 0 : contains(p->child[i], key);
}
void insert_nonfull(int id, int key)
{
    BNode *p = &nodes[id];
    int i = p->count - 1;
    if (p->leaf) {
        while (i >= 0 && key < p->key[i]) {
            p->key[i + 1] = p->key[i];
            i--;
        }
        p->key[i + 1] = key;
        p->count++;
        return;
    }
    while (i >= 0 && key < p->key[i]) {
        i--;
    }
    i++;
    if (nodes[p->child[i]].count == 3) {
        split_child(id, i);
        if (key > p->key[i]) {
            i++;
        }
    }
    insert_nonfull(p->child[i], key);
}
int insert(int root, int key)
{
    if (contains(root, key)) {
        return root;
    }
    if (nodes[root].count == 3) {
        int next = make_node(0);
        nodes[next].child[0] = root;
        split_child(next, 0);
        root = next;
    }
    insert_nonfull(root, key);
    return root;
}

int read_btree(int *root)
{
    int n, key;
    *root = make_node(1);
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) {
        return 0;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &key) != 1 || key < -99 || key > 99) {
            return 0;
        }
        *root = insert(*root, key);
    }
    return 1;
}
int main(void)
{
    int root;
    puts("Count and keys:");
    if (!read_btree(&root)) {
        return 1;
    }
    int key;
    if (scanf("%d", &key) != 1) {
        return 1;
    }
    printf("found=%d\n", contains(root, key));
    return 0;
}
