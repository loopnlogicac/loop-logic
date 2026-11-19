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

int survivor(Node *tail, int step)
{
    if (tail == NULL) {
        return -1;
    }
    Node *cur = tail->next;
    Node *prev = tail;
    while (cur->next != cur) {
        for (int count = 1; count < step; count++) {
            prev = cur;
            cur = cur->next;
        }
        Node *next = cur->next;
        printf("Remove: %d\n", cur->value);
        prev->next = next;
        free(cur);
        cur = next;
    }
    int answer = cur->value;
    free(cur);
    return answer;
}

int main(void)
{
    printf("Enter count and values: ");
    Node *head = read_list();
    int step;
    if (scanf("%d", &step) != 1 || step < 1 || step > 16) {
        destroy(head);
        return 1;
    }
    int answer = survivor(make_circle(head), step);
    printf("Survivor: %d\n", answer);
    return 0;
}
