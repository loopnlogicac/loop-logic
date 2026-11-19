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

void postorder(const Node *r)
{
    if (r != NULL) {
        postorder(r->left);
        postorder(r->right);
        printf(" %d", r->key);
    }
}

Node *rebuild(const int pre[], const int in[], int lo, int hi, int n, int *pos, int *ok)
{
    if (lo >= hi || !*ok) {
        return NULL;
    }
    if (*pos >= n) {
        *ok = 0;
        return NULL;
    }
    int key = pre[(*pos)++], split = lo;
    while (split < hi && in[split] != key) {
        split++;
    }
    if (split == hi) {
        *ok = 0;
        return NULL;
    }
    Node *r = make_node(key);
    if (r == NULL) {
        *ok = 0;
        return NULL;
    }
    r->left = rebuild(pre, in, lo, split, n, pos, ok);
    r->right = rebuild(pre, in, split + 1, hi, n, pos, ok);
    return r;
}
int main(void)
{
    int n, pre[12], in[12], pos = 0, ok = 1;
    puts("Count, preorder, inorder (distinct keys):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &pre[i]) != 1) {
            return 1;
        }
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &in[i]) != 1) {
            return 1;
        }
        for (int j = 0; j < i; j++) {
            if (in[i] == in[j]) {
                ok = 0;
            }
        }
    }
    Node *root = rebuild(pre, in, 0, n, n, &pos, &ok);
    if (!ok || pos != n) {
        puts("Invalid traversals");
    } else {
        printf("postorder:");
        postorder(root);
        puts("");
    }
    destroy(root);
    return 0;
}
