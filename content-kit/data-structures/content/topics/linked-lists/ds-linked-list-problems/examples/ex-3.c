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

int main(void)
{
    printf("Enter first count and sorted values: ");
    Node *a = read_list();
    Node *b = NULL;
    int second[] = {15, 35, 55};
    for (int i = 0; i < 3; i++) {
        if (!append(&b, second[i])) {
            destroy(a);
            destroy(b);
            return 1;
        }
    }
    Node *head = merge(a, b);
    print_list(head);
    destroy(head);
    return 0;
}
