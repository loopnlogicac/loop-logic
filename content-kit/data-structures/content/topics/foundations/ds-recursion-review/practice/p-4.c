#include <stdio.h>

typedef struct Tree {
    struct Tree *left;
    struct Tree *right;
} Tree;

int leaves(const Tree *root)
{
    if (root == NULL) {
        return 0;
    }
    if (root->left == NULL && root->right == NULL) {
        return 1;
    }
    return leaves(root->left) + leaves(root->right);
}

int main(void)
{
    int mask;
    printf("Enter child mask: ");
    if (scanf("%d", &mask) != 1 || mask < 0 || mask > 3) {
        return 1;
    }
    Tree left = {NULL, NULL};
    Tree right = {NULL, NULL};
    Tree root = {mask & 1 ? &left : NULL, mask & 2 ? &right : NULL};
    printf("Leaves: %d\n", leaves(&root));
    return 0;
}
