#include <stdio.h>


#define CAPACITY 4
typedef struct {
    int items[CAPACITY];
    int top;
} Stack;
static int isEmpty(const Stack *stack)
{
    return stack->top == -1;
}
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
static int pop(Stack *stack, int *value)
{
    if (isEmpty(stack)) {
        return 0;
    }
    *value = stack->items[stack->top--];
    return 1;
}


int main(void)
{
    Stack stack = {.top = -1};
    int n;
    int maximum = 0;
    puts("Count and commands (0 pops, other integers push):");
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
            (void)pop(&stack, &value);
        } else {
            (void)push(&stack, command);
        }
        if (stack.top + 1 > maximum) {
            maximum = stack.top + 1;
        }
    }
    printf("Maximum: %d\n", maximum);
    return 0;
}
