#include <stdio.h>
#include <stdlib.h>
#include "queue.h"

int main(void)
{
    struct LinkedQueue queue = {0};
    if (!linked_enqueue(&queue, 101)) {
        return EXIT_FAILURE;
    }
    int value;
    if (linked_dequeue(&queue, &value)) {
        printf("Served roll: %d\n", value);
    }
    printf("Both empty: %d\n", queue.front == NULL && queue.rear == NULL);
    if (!linked_enqueue(&queue, 102) || !linked_enqueue(&queue, 103)) {
        queue_clear(&queue);
        return EXIT_FAILURE;
    }
    while (linked_dequeue(&queue, &value)) {
        printf("Served roll: %d\n", value);
    }
    queue_clear(&queue);
    return 0;
}
