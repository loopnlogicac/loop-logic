#include <stdlib.h>
#include "queue.h"

int enqueue(struct ArrayQueue *queue, int value)
{
    if (queue->count == QUEUE_CAPACITY) {
        return 0;
    }
    size_t rear = (queue->front + queue->count) % QUEUE_CAPACITY;
    queue->values[rear] = value;
    ++queue->count;
    return 1;
}

int dequeue(struct ArrayQueue *queue, int *value)
{
    if (queue->count == 0) {
        return 0;
    }
    *value = queue->values[queue->front];
    queue->front = (queue->front + 1) % QUEUE_CAPACITY;
    --queue->count;
    return 1;
}

int queue_peek(const struct ArrayQueue *queue, int *value)
{
    if (queue->count == 0) {
        return 0;
    }
    *value = queue->values[queue->front];
    return 1;
}

int linked_enqueue(struct LinkedQueue *queue, int value)
{
    struct QueueNode *node = malloc(sizeof *node);
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

int linked_dequeue(struct LinkedQueue *queue, int *value)
{
    if (queue->front == NULL) {
        return 0;
    }
    struct QueueNode *node = queue->front;
    *value = node->value;
    queue->front = node->next;
    if (queue->front == NULL) {
        queue->rear = NULL;
    }
    free(node);
    return 1;
}

void queue_clear(struct LinkedQueue *queue)
{
    int ignored;
    while (linked_dequeue(queue, &ignored)) {
    }
}
