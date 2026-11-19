#include <stdio.h>


#define CAPACITY 4
typedef struct {
    int items[CAPACITY];
    int top;
} Stack;

static int isFull(const Stack *stack)
{
    return stack->top == CAPACITY - 1;
}
static int push(Stack *stack, int value)
{
    if (isFull(stack)) {
        return 0;
    }
    stack->items[++stack->top] = value;
    return 1;
}



int main(void)
{
    Stack stack = {.top = -1};
    int n;
    int rejected = 0;
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1) {
            return 1;
        }
        if (!push(&stack, value)) {
            rejected++;
        }
    }
    printf("Rejected: %d\n", rejected);
    return 0;
}
