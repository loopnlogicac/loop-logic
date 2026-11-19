#include <stdio.h>


#define CAPACITY 4
typedef struct {
    int items[CAPACITY];
    int front;
    int rear;
    int count;
} Queue;
static int enqueue(Queue *queue, int value)
{
    if (queue->count == CAPACITY - 1) {
        return 0;
    }
    queue->items[queue->rear] = value;
    queue->rear = (queue->rear + 1) % CAPACITY;
    queue->count++;
    return 1;
}
static int dequeue(Queue *queue, int *value)
{
    if (queue->count == 0) {
        return 0;
    }
    *value = queue->items[queue->front];
    queue->items[queue->front] = 0;
    queue->front = (queue->front + 1) % CAPACITY;
    queue->count--;
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
            puts("Full");
        }
    }
    printf("Cells:");
    for (int i = 0; i < CAPACITY; i++) {
        printf(" %d", queue.items[i]);
    }
    printf("\nIndices: %d %d Count: %d\n", queue.front, queue.rear, queue.count);
    return 0;
}
