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

int size(const Node *root)
{
    return root == NULL ? 0 : 1 + size(root->left) + size(root->right);
}

Node *search_recursive(Node *root, int key)
{
    if (root == NULL || root->key == key) {
        return root;
    }
    return search_recursive(key < root->key ? root->left : root->right, key);
}

int insert_iterative(Node **root, int key)
{
    while (*root != NULL) {
        if ((*root)->key == key) {
            return 1;
        }
        root = key < (*root)->key ? &(*root)->left : &(*root)->right;
    }
    *root = make_node(key);
    return *root != NULL;
}

int main(void)
{
    Node *root = NULL;
    int a[] = {8, 3, 10, 6, 3};
    for (int i = 0; i < 5; i++) {
        if (!insert_iterative(&root, a[i])) {
            destroy(root);
            return 1;
        }
    }
    printf("found=%d size=%d\n", search_recursive(root, 6) != NULL, size(root));
    destroy(root);
    return 0;
}
