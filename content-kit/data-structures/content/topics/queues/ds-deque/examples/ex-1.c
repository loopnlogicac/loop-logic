#include <stdio.h>


#define CAPACITY 4
typedef struct {
    int items[CAPACITY];
    int front;
    int count;
} Deque;
static int insert(Deque *deque, int value, int at_front)
{
    if (deque->count == CAPACITY) {
        return 0;
    }
    if (at_front) {
        deque->front = (deque->front + CAPACITY - 1) % CAPACITY;
    }
    int index = at_front ? deque->front : (deque->front + deque->count) % CAPACITY;
    deque->items[index] = value;
    deque->count++;
    return 1;
}
static int erase(Deque *deque, int *value, int at_front)
{
    if (deque->count == 0) {
        return 0;
    }
    int index = at_front ? deque->front : (deque->front + deque->count - 1) % CAPACITY;
    *value = deque->items[index];
    if (at_front) {
        deque->front = (deque->front + 1) % CAPACITY;
    }
    deque->count--;
    return 1;
}

int main(void)
{
    Deque deque = {0};
    int n;
    puts("Count, then pairs: operation (1 front-in, 2 rear-in, 3 front-out, 4 rear-out), value");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int operation;
        int value;
        if (scanf("%d%d", &operation, &value) != 2 || operation < 1 || operation > 4) {
            return 1;
        }
        if (operation <= 2) {
            if (!insert(&deque, value, operation == 1)) {
                puts("Full");
            }
        } else if (erase(&deque, &value, operation == 3)) {
            printf("Removed: %d\n", value);
        } else {
            puts("Empty");
        }
    }
    printf("Items:");
    for (int i = 0; i < deque.count; i++) {
        printf(" %d", deque.items[(deque.front + i) % CAPACITY]);
    }
    putchar('\n');
    return 0;
}
