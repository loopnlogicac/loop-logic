#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int key, height;
    struct Node *left, *right;
} Node;
int height(const Node *r)
{
    return r == NULL ? 0 : r->height;
}
void update(Node *r)
{
    int l = height(r->left), right = height(r->right);
    r->height = 1 + (l > right ? l : right);
}
void destroy(Node *r)
{
    if (r != NULL) {
        destroy(r->left);
        destroy(r->right);
        free(r);
    }
}
Node *rotate_right(Node *y)
{
    Node *x = y->left, *middle = x->right;
    y->left = middle;
    x->right = y;
    update(y);
    update(x);
    return x;
}
Node *rotate_left(Node *x)
{
    Node *y = x->right, *middle = y->left;
    x->right = middle;
    y->left = x;
    update(x);
    update(y);
    return y;
}
Node *insert(Node *root, int key, int *ok)
{
    if (root == NULL) {
        Node *p = malloc(sizeof *p);
        if (p == NULL) {
            *ok = 0;
            return NULL;
        }
        *p = (Node){key, 1, NULL, NULL};
        return p;
    }
    if (key < root->key) {
        root->left = insert(root->left, key, ok);
    } else if (key > root->key) {
        root->right = insert(root->right, key, ok);
    } else {
        return root;
    }
    if (!*ok) {
        return root;
    }
    update(root);
    int balance = height(root->left) - height(root->right);
    if (balance > 1) {
        if (key > root->left->key) {
            root->left = rotate_left(root->left);
        }
        return rotate_right(root);
    }
    if (balance < -1) {
        if (key < root->right->key) {
            root->right = rotate_right(root->right);
        }
        return rotate_left(root);
    }
    return root;
}

int valid(const Node *r)
{
    if (r == NULL) {
        return 1;
    }
    int b = height(r->left) - height(r->right);
    int h = 1 + (height(r->left) > height(r->right) ? height(r->left) : height(r->right));
    return b >= -1 && b <= 1 && r->height == h && valid(r->left) && valid(r->right);
}
int main(void)
{
    int a[4][3] = {{30, 20, 10}, {10, 20, 30}, {30, 10, 20}, {10, 30, 20}};
    for (int c = 0; c < 4; c++) {
        Node *root = NULL;
        int ok = 1;
        for (int i = 0; i < 3; i++) {
            root = insert(root, a[c][i], &ok);
        }
        if (!ok) {
            destroy(root);
            return 1;
        }
        printf("case=%d root=%d height=%d valid=%d\n", c, root->key, height(root), valid(root));
        destroy(root);
    }
    return 0;
}
