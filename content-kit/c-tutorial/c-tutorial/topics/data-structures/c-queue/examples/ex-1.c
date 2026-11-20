#include <stdio.h>
#include "queue.h"

int main(void)
{
    struct ArrayQueue queue = {0};
    for (int i = 1; i <= 4; ++i) {
        if (!enqueue(&queue, i * 10)) {
            return 1;
        }
    }
    printf("Full rejection: %d\n", enqueue(&queue, 99));
    int value;
    if (dequeue(&queue, &value)) {
        printf("Served: %d\n", value);
    }
    if (dequeue(&queue, &value)) {
        printf("Served: %d\n", value);
    }
    if (!enqueue(&queue, 50) || !enqueue(&queue, 60)) {
        return 1;
    }
    while (dequeue(&queue, &value)) {
        printf("Next: %d\n", value);
    }
    return 0;
}
