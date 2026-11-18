#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *prev;
    struct Node *next;
} Node;

int append(Node **head, Node **tail, int value)
{
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return 0;
    }
    *node = (Node){value, *tail, NULL};
    if (*tail != NULL) {
        (*tail)->next = node;
    } else {
        *head = node;
    }
    *tail = node;
    return 1;
}

void destroy(Node *head)
{
    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
}

void show(Node *head, Node *tail)
{
    printf("Forward:");
    for (Node *cur = head; cur != NULL; cur = cur->next) {
        printf(" %d", cur->value);
    }
    printf("\nBackward:");
    for (Node *cur = tail; cur != NULL; cur = cur->prev) {
        printf(" %d", cur->value);
    }
    putchar('\n');
}

int insert_after(Node **head, Node **tail, Node *cur, int value)
{
    if (cur == NULL) {
        return *head == NULL ? append(head, tail, value) : 0;
    }
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return 0;
    }
    *node = (Node){value, cur, cur->next};
    if (cur->next != NULL) {
        cur->next->prev = node;
    } else {
        *tail = node;
    }
    cur->next = node;
    return 1;
}

int main(void)
{
    int n;
    Node *head = NULL;
    Node *tail = NULL;
    printf("Enter count and values: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < -99 || value > 99
            || !append(&head, &tail, value)) {
            destroy(head);
            return 1;
        }
    }
    int index;
    int value;
    if (scanf("%d%d", &index, &value) != 2 || index < -1 || index >= n
        || (n > 0 && index < 0) || value < -99 || value > 99) {
        destroy(head);
        return 1;
    }
    Node *cur = head;
    for (int i = 0; i < index; i++) {
        cur = cur->next;
    }
    if (!insert_after(&head, &tail, cur, value)) {
        destroy(head);
        return 1;
    }
    show(head, tail);
    destroy(head);
    return 0;
}
