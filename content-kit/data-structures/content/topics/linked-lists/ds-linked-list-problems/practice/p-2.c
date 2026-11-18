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

Node *nth_from_end(Node *head, int n)
{
    if (n < 1) {
        return NULL;
    }
    Node *fast = head;
    for (int i = 0; i < n; i++) {
        if (fast == NULL) {
            return NULL;
        }
        fast = fast->next;
    }
    Node *slow = head;
    while (fast != NULL) {
        slow = slow->next;
        fast = fast->next;
    }
    return slow;
}

int main(void)
{
    printf("Enter count and values: ");
    Node *head = read_list();
    int k;
    if (scanf("%d", &k) != 1 || k < 1 || k > 17) {
        destroy(head);
        return 1;
    }
    Node *cur = nth_from_end(head, k);
    if (cur == NULL) {
        printf("Result: absent\n");
    } else {
        printf("Result: %d\n", cur->value);
    }
    destroy(head);
    return 0;
}
