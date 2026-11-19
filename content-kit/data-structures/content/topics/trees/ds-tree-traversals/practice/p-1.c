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
void reverse_level(const Node *root)
{
    const Node *q[12];
    int f = 0, r = 0;
    if (root != NULL) {
        q[r++] = root;
    }
    while (f < r) {
        const Node *p = q[f++];
        if (p->left != NULL) {
            q[r++] = p->left;
        }
        if (p->right != NULL) {
            q[r++] = p->right;
        }
    }
    while (r > 0) {
        printf(" %d", q[--r]->key);
    }
}

int main(void)
{
    Node *root = NULL;
    puts("Count and keys:");
    if (!read_complete(&root)) {
        destroy(root);
        return 1;
    }
    printf("reverse:");
    reverse_level(root);
    puts("");
    destroy(root);
    return 0;
}
