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
    int rolls[] = {11, 22, 33, 44};
    for (int i = 0; i < 4; i++) {
        if (!push(&stack, rolls[i])) {
            return 1;
        }
    }
    int value;
    while (pop(&stack, &value)) {
        printf("%d\n", value);
    }
    return 0;
}
