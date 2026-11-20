#include <stdio.h>
#include "queue.h"

int main(void)
{
    int remaining[] = {2, 1, 3};
    struct ArrayQueue queue = {0};
    for (int i = 0; i < 3; ++i) {
        if (!enqueue(&queue, i)) {
            return 1;
        }
    }
    int job;
    while (dequeue(&queue, &job)) {
        printf("Run: %d\n", job + 1);
        --remaining[job];
        if (remaining[job] > 0 && !enqueue(&queue, job)) {
            return 1;
        }
    }
    return 0;
}
