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
    Node *head = NULL;
    if (!prepend(&head, 85) || !prepend(&head, 72)) {
        destroy(head);
        return 1;
    }
    print_list(head);
    destroy(head);
    return 0;
}
