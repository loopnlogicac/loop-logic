#ifndef TEACH_QUEUE_H
#define TEACH_QUEUE_H
#include <stddef.h>

enum { QUEUE_CAPACITY = 4 };
struct ArrayQueue { int values[QUEUE_CAPACITY]; size_t front; size_t count; };
struct QueueNode { int value; struct QueueNode *next; };
struct LinkedQueue { struct QueueNode *front; struct QueueNode *rear; };
int enqueue(struct ArrayQueue *queue, int value);
int dequeue(struct ArrayQueue *queue, int *value);
int queue_peek(const struct ArrayQueue *queue, int *value);
int linked_enqueue(struct LinkedQueue *queue, int value);
int linked_dequeue(struct LinkedQueue *queue, int *value);
void queue_clear(struct LinkedQueue *queue);
#endif
