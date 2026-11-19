#include <stdio.h>


#define CAPACITY 4
typedef struct {
    int items[CAPACITY];
    int front;
    int rear;
} Queue;
static int enqueue(Queue *queue, int value)
{
    if (queue->rear == CAPACITY) {
        return 0;
    }
    queue->items[queue->rear++] = value;
    return 1;
}
static int dequeue(Queue *queue, int *value)
{
    if (queue->front == queue->rear) {
        return 0;
    }
    *value = queue->items[queue->front++];
    return 1;
}

int main(void)
{
    Queue queue = {0};
    int n;
    puts("Count and commands (0 dequeues, other integers enqueue):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int command;
        int value;
        if (scanf("%d", &command) != 1) {
            return 1;
        }
        if (command == 0) {
            if (dequeue(&queue, &value)) {
                printf("Removed: %d\n", value);
            } else {
                puts("Empty");
            }
        } else if (!enqueue(&queue, command)) {
            puts("No rear space");
        }
    }
    printf("Items:");
    for (int i = queue.front; i < queue.rear; i++) {
        printf(" %d", queue.items[i]);
    }
    printf("\nIndices: %d %d\n", queue.front, queue.rear);
    return 0;
}
