#include <stdio.h>
#include <stdlib.h>


typedef struct Node {
    int value;
    struct Node *next;
} Node;
typedef struct {
    Node *front;
    Node *rear;
} Queue;
static int enqueue(Queue *queue, int value)
{
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return 0;
    }
    node->value = value;
    node->next = NULL;
    if (queue->rear == NULL) {
        queue->front = node;
    } else {
        queue->rear->next = node;
    }
    queue->rear = node;
    return 1;
}
static int dequeue(Queue *queue, int *value)
{
    if (queue->front == NULL) {
        return 0;
    }
    Node *old = queue->front;
    *value = old->value;
    queue->front = old->next;
    if (queue->front == NULL) {
        queue->rear = NULL;
    }
    free(old);
    return 1;
}
static void clear(Queue *queue)
{
    int value;
    while (dequeue(queue, &value)) {
    }
}

int main(void)
{
    Queue queue = {0};
    int n;
    puts("Size and values (-99..99):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < -99 || value > 99
            || !enqueue(&queue, value)) {
            clear(&queue);
            return 1;
        }
    }
    int value;
    printf("Served:");
    while (dequeue(&queue, &value)) {
        printf(" %d", value);
    }
    putchar('\n');
    return 0;
}
