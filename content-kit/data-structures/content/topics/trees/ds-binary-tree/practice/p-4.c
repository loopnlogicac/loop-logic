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

Node *build(const int a[], int n, int i, int *ok)
{
    if (i >= n || !*ok) {
        return NULL;
    }
    Node *root = make_node(a[i]);
    if (root == NULL) {
        *ok = 0;
        return NULL;
    }
    root->left = build(a, n, 2 * i + 1, ok);
    root->right = build(a, n, 2 * i + 2, ok);
    return root;
}

int read_complete(Node **root)
{
    int n, a[12], ok = 1;
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) {
        return 0;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < -99 || a[i] > 99) {
            return 0;
        }
    }
    *root = build(a, n, 0, &ok);
    return ok;
}
int subtree_sum(const Node *r)
{
    if (r == NULL) {
        return 0;
    }
    int total = r->key + subtree_sum(r->left) + subtree_sum(r->right);
    printf("key=%d sum=%d\n", r->key, total);
    return total;
}

int main(void)
{
    Node *root = NULL;
    puts("Count and keys:");
    if (!read_complete(&root)) {
        destroy(root);
        return 1;
    }
    printf("total=%d\n", subtree_sum(root));
    destroy(root);
    return 0;
}
