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

Node *make_circle(Node *head)
{
    if (head == NULL) {
        return NULL;
    }
    Node *tail = head;
    while (tail->next != NULL) {
        tail = tail->next;
    }
    tail->next = head;
    return tail;
}

void show_circle(Node *tail)
{
    printf("Circle:");
    if (tail != NULL) {
        Node *head = tail->next;
        Node *cur = head;
        do {
            printf(" %d", cur->value);
            cur = cur->next;
        } while (cur != head);
    }
    putchar('\n');
}

void destroy_circle(Node *tail)
{
    if (tail != NULL) {
        Node *head = tail->next;
        tail->next = NULL;
        destroy(head);
    }
}

int main(void)
{
    printf("Enter count and values: ");
    Node *head = read_list();
    Node *tail = make_circle(head);
    show_circle(tail);
    destroy_circle(tail);
    return 0;
}
