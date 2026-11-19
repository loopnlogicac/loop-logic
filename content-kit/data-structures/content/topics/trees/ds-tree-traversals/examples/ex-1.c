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

void inorder(const Node *root)
{
    if (root != NULL) {
        inorder(root->left);
        printf(" %d", root->key);
        inorder(root->right);
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
void preorder(const Node *r)
{
    if (r != NULL) {
        printf(" %d", r->key);
        preorder(r->left);
        preorder(r->right);
    }
}
void postorder(const Node *r)
{
    if (r != NULL) {
        postorder(r->left);
        postorder(r->right);
        printf(" %d", r->key);
    }
}
void level_order(const Node *root)
{
    const Node *queue[12];
    int front = 0, rear = 0;
    if (root != NULL) {
        queue[rear++] = root;
    }
    while (front < rear) {
        const Node *cur = queue[front++];
        printf(" %d", cur->key);
        if (cur->left != NULL) {
            queue[rear++] = cur->left;
        }
        if (cur->right != NULL) {
            queue[rear++] = cur->right;
        }
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
    int mode;
    puts("Mode (0 preorder, 1 inorder, 2 postorder, 3 level):");
    if (scanf("%d", &mode) != 1 || mode < 0 || mode > 3) {
        destroy(root);
        return 1;
    }
    printf("order:");
    if (mode == 0) {
        preorder(root);
    }
    if (mode == 1) {
        inorder(root);
    }
    if (mode == 2) {
        postorder(root);
    }
    if (mode == 3) {
        level_order(root);
    }
    puts("");
    destroy(root);
    return 0;
}
