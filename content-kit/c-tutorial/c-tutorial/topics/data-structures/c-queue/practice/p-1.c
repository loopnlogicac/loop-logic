#include <stdio.h>
#include "queue.h"

int main(void)
{
    int n;
    struct ArrayQueue queue = {0};
    if (scanf("%d", &n) != 1 || n < 0 || n > QUEUE_CAPACITY) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < n; ++i) {
        int roll;
        if (scanf("%d", &roll) != 1 || roll < 1 || roll > 999 || !enqueue(&queue, roll)) {
            puts("invalid");
            return 0;
        }
    }
    int value;
    while (dequeue(&queue, &value)) {
        printf("%d\n", value);
    }
    return 0;
}
