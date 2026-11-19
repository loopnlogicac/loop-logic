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
static int peek(const Stack *stack, int *value)
{
    if (isEmpty(stack)) {
        return 0;
    }
    *value = stack->items[stack->top];
    return 1;
}

int main(void)
{
    Stack stack = {.top = -1};
    int n;
    int value = 0;
    puts("Commands: count, then push-value (nonzero), pop (0), peek (100)");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int command;
        if (scanf("%d", &command) != 1) {
            return 1;
        }
        if (command == 0) {
            if (pop(&stack, &value)) {
                printf("Pop: %d\n", value);
            } else {
                puts("Underflow");
            }
        } else if (command == 100) {
            if (peek(&stack, &value)) {
                printf("Peek: %d\n", value);
            } else {
                puts("Empty");
            }
        } else if (!push(&stack, command)) {
            puts("Overflow");
        }
    }
    printf("Items:");
    for (int i = 0; i <= stack.top; i++) {
        printf(" %d", stack.items[i]);
    }
    putchar('\n');
    return 0;
}
