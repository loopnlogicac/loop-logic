#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

int main(void)
{
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return 1;
    }
    *node = (Node){85, NULL};
    printf("Value: %d\n", node->value);
    free(node);
    node = NULL;
    printf("Owner cleared: %d\n", node == NULL);
    return 0;
}
