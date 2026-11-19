#include <stdlib.h>
#include "stack.h"

int array_push(struct ArrayStack *stack, int value)
{
    if (stack->count == STACK_CAPACITY) {
        return 0;
    }
    stack->values[stack->count] = value;
    ++stack->count;
    return 1;
}

int array_pop(struct ArrayStack *stack, int *value)
{
    if (stack->count == 0) {
        return 0;
    }
    --stack->count;
    *value = stack->values[stack->count];
    return 1;
}

int array_peek(const struct ArrayStack *stack, int *value)
{
    if (stack->count == 0) {
        return 0;
    }
    *value = stack->values[stack->count - 1];
    return 1;
}

int linked_push(struct StackNode **top, int value)
{
    struct StackNode *node = malloc(sizeof *node);
    if (node == NULL) {
        return 0;
    }
    node->value = value;
    node->next = *top;
    *top = node;
    return 1;
}

int linked_pop(struct StackNode **top, int *value)
{
    if (*top == NULL) {
        return 0;
    }
    struct StackNode *node = *top;
    *value = node->value;
    *top = node->next;
    free(node);
    return 1;
}

int linked_peek(const struct StackNode *top, int *value)
{
    if (top == NULL) {
        return 0;
    }
    *value = top->value;
    return 1;
}

void linked_clear(struct StackNode **top)
{
    int ignored;
    while (linked_pop(top, &ignored)) {
    }
}
