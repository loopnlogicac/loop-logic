#include <stdio.h>
#include "queue.h"

int main(void)
{
    int commands;
    struct ArrayQueue queue = {0};
    if (scanf("%d", &commands) != 1 || commands < 0 || commands > 20) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < commands; ++i) {
        char command;
        int value;
        if (scanf(" %c", &command) != 1) {
            puts("invalid");
            return 0;
        }
        if (command == 'E') {
            if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
                puts("invalid");
                return 0;
            }
            puts(enqueue(&queue, value) ? "ok" : "full");
        } else if (command == 'D' || command == 'P') {
            int ok = command == 'D' ? dequeue(&queue, &value) : queue_peek(&queue, &value);
            if (ok) {
                printf("%d\n", value);
            } else {
                puts("empty");
            }
        } else {
            puts("invalid");
            return 0;
        }
    }
    return 0;
}
