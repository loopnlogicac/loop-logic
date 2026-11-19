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
    puts("Size and values (-99..99):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 4) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < -99 || value > 99) {
            return 1;
        }
        (void)push(&stack, value);
    }
    int sum = 0;
    int value;
    while (pop(&stack, &value)) {
        sum += value;
    }
    printf("Sum: %d\n", sum);
    return 0;
}
