#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int key;
    struct Node *left, *right;
} Node;

Node *make_node(int key)
{
    Node *p = malloc(sizeof *p);
    if (p != NULL) {
        *p = (Node){key, NULL, NULL};
    }
    return p;
}

void destroy(Node *root)
{
    if (root != NULL) {
        destroy(root->left);
        destroy(root->right);
        free(root);
    }
}

int insert(Node **root, int key)
{
    if (*root == NULL) {
        *root = make_node(key);
        return *root != NULL;
    }
    if (key < (*root)->key) {
        return insert(&(*root)->left, key);
    }
    if (key > (*root)->key) {
        return insert(&(*root)->right, key);
    }
    return 1; /* A duplicate leaves the set unchanged. */
}

int read_tree(Node **root)
{
    int n, key;
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) {
        return 0;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &key) != 1 || key < -99 || key > 99 || !insert(root, key)) {
            return 0;
        }
    }
    return 1;
}

int main(void)
{
    Node *root = NULL;
    puts("Count and keys:");
    if (!read_tree(&root)) {
        destroy(root);
        return 1;
    }
    int key, comparisons = 0;
    Node *cur = root;
    if (scanf("%d", &key) != 1) {
        destroy(root);
        return 1;
    }
    while (cur != NULL) {
        comparisons++;
        if (cur->key == key) {
            break;
        }
        cur = key < cur->key ? cur->left : cur->right;
    }
    printf("comparisons=%d found=%d\n", comparisons, cur != NULL);
    destroy(root);
    return 0;
}
