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

int main(void)
{
    Node *head = NULL;
    Node *tail = NULL;
    for (int value = 1; value <= 3; value++) {
        Node *node = malloc(sizeof *node);
        if (node == NULL) {
            destroy(head);
            return 1;
        }
        *node = (Node){value, NULL};
        if (tail == NULL) {
            head = node;
        } else {
            tail->next = node;
        }
        tail = node;
    }
    print_list(head);
    printf("Tail: %d\n", tail->value);
    destroy(head);
    return 0;
}
