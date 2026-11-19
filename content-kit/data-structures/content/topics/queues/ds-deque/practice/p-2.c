#include <stdio.h>
#include <stdlib.h>


typedef struct Node {
    int value;
    struct Node *prev;
    struct Node *next;
} Node;
typedef struct {
    Node *front;
    Node *rear;
} Deque;
static int insert(Deque *deque, int value, int at_front)
{
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return 0;
    }
    node->value = value;
    node->prev = at_front ? NULL : deque->rear;
    node->next = at_front ? deque->front : NULL;
    if (at_front) {
        if (deque->front != NULL) {
            deque->front->prev = node;
        } else {
            deque->rear = node;
        }
        deque->front = node;
    } else {
        if (deque->rear != NULL) {
            deque->rear->next = node;
        } else {
            deque->front = node;
        }
        deque->rear = node;
    }
    return 1;
}
static int erase(Deque *deque, int *value, int at_front)
{
    Node *old = at_front ? deque->front : deque->rear;
    if (old == NULL) {
        return 0;
    }
    *value = old->value;
    if (old->prev != NULL) {
        old->prev->next = old->next;
    } else {
        deque->front = old->next;
    }
    if (old->next != NULL) {
        old->next->prev = old->prev;
    } else {
        deque->rear = old->prev;
    }
    free(old);
    return 1;
}

int main(void)
{
    Deque deque = {0};
    int n;
    puts("Size and values (-99..99), alternating front and rear insertion:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < -99 || value > 99
            || !insert(&deque, value, i % 2 == 0)) {
            while (erase(&deque, &value, 1)) {
            }
            return 1;
        }
    }
    int value;
    printf("Removed from rear:");
    while (erase(&deque, &value, 0)) {
        printf(" %d", value);
    }
    putchar('\n');
    return 0;
}
