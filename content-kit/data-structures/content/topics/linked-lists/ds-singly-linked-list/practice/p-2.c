#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

void destroy(Node *head)
{
    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
}

void print_list(const Node *head)
{
    printf("List:");
    for (const Node *cur = head; cur != NULL; cur = cur->next) {
        printf(" %d", cur->value);
    }
    putchar('\n');
}

int prepend(Node **head, int value)
{
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return 0;
    }
    *node = (Node){value, *head};
    *head = node;
    return 1;
}

int main(void)
{
    printf("Enter count and values: ");
    int n;
    Node *head = NULL;
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < -99 || value > 99
            || !prepend(&head, value)) {
            destroy(head);
            return 1;
        }
    }
    print_list(head);
    destroy(head);
    return 0;
}
