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

Node *minimum(Node *root)
{
    while (root != NULL && root->left != NULL) {
        root = root->left;
    }
    return root;
}

Node *successor(Node *root, int key)
{
    Node *candidate = NULL;
    while (root != NULL) {
        if (root->key > key) {
            candidate = root;
            root = root->left;
        } else {
            root = root->right;
        }
    }
    return candidate; /* Smallest stored key strictly greater than key. */
}

int main(void)
{
    Node *root = NULL;
    puts("Count and keys:");
    if (!read_tree(&root)) {
        destroy(root);
        return 1;
    }
    Node *lo = minimum(root), *hi = root, *next = successor(root, 8);
    while (hi != NULL && hi->right != NULL) {
        hi = hi->right;
    }
    if (lo != NULL) {
        printf("min=%d max=%d\n", lo->key, hi->key);
    }
    if (next != NULL) {
        printf("successor(8)=%d\n", next->key);
    } else {
        puts("No successor of 8");
    }
    destroy(root);
    return 0;
}
