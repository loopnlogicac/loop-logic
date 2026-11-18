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

int append(Node **head, int value)
{
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return 0;
    }
    node->value = value;
    node->next = NULL;
    while (*head != NULL) {
        head = &(*head)->next;
    }
    *head = node;
    return 1;
}

Node *read_list(void)
{
    int n;
    Node *head = NULL;
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        exit(EXIT_FAILURE);
    }
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < -99 || value > 99
            || !append(&head, value)) {
            destroy(head);
            exit(EXIT_FAILURE);
        }
    }
    return head;
}

void print_list(const Node *head)
{
    printf("List:");
    for (const Node *cur = head; cur != NULL; cur = cur->next) {
        printf(" %d", cur->value);
    }
    putchar('\n');
}

Node *merge(Node *a, Node *b)
{
    Node dummy = {0, NULL};
    Node *tail = &dummy;
    while (a != NULL && b != NULL) {
        if (a->value <= b->value) {
            tail->next = a;
            a = a->next;
        } else {
            tail->next = b;
            b = b->next;
        }
        tail = tail->next;
    }
    tail->next = a != NULL ? a : b;
    return dummy.next;
}

void unique_sorted(Node *head)
{
    for (Node *cur = head; cur != NULL && cur->next != NULL;) {
        if (cur->value == cur->next->value) {
            Node *victim = cur->next;
            cur->next = victim->next;
            free(victim);
        } else {
            cur = cur->next;
        }
    }
}

int main(void)
{
    printf("Enter count and values: ");
    Node *head = read_list();
    Node *other = NULL;
    int m;
    if (scanf("%d", &m) != 1 || m < 0 || m > 16) {
        destroy(head);
        return 1;
    }
    for (int i = 0; i < m; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < -99 || value > 99
            || !append(&other, value)) {
            destroy(head);
            destroy(other);
            return 1;
        }
    }
    head = merge(head, other);
    unique_sorted(head);
    print_list(head);
    destroy(head);
    return 0;
}
