#include <stdio.h>
#include <stdlib.h>


typedef struct Node {
    int value;
    struct Node *next;
} Node;
static int push(Node **top, int value)
{
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return 0;
    }
    node->value = value;
    node->next = *top;
    *top = node;
    return 1;
}
static int pop(Node **top, int *value)
{
    if (*top == NULL) {
        return 0;
    }
    Node *old = *top;
    *value = old->value;
    *top = old->next;
    free(old);
    return 1;
}

int main(void)
{
    Node *top = NULL;
    int n;
    puts("Size and values (-99..99):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < -99 || value > 99
            || !push(&top, value)) {
            while (top != NULL) {
                int discarded;
                (void)pop(&top, &discarded);
            }
            return 1;
        }
    }
    int value;
    int total = 0;
    while (pop(&top, &value)) {
        total += value > 0;
    }
    printf("Result: %d\n", total);

    return 0;
}
