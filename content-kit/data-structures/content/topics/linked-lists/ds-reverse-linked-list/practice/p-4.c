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

int main(void)
{
    printf("Enter count and values: ");
    Node *head = read_list();
    int k;
    int size = 0;
    for (Node *cur = head; cur != NULL; cur = cur->next) {
        size++;
    }
    if (scanf("%d", &k) != 1 || k < 0 || k > size) {
        destroy(head);
        return 1;
    }
    Node *prev = NULL;
    Node *cur = head;
    for (int i = 0; i < k; i++) {
        Node *next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    if (k > 0) {
        head->next = cur;
        head = prev;
    }
    print_list(head);
    destroy(head);
    return 0;
}
