#include <stdio.h>
#include "stack.h"

int main(void)
{
    struct ArrayStack stack = {0};
    if (!array_push(&stack, 10) || !array_push(&stack, 20)) {
        return 1;
    }
    int value;
    if (array_peek(&stack, &value)) {
        printf("Peek: %d; count: %zu\n", value, stack.count);
    }
    while (array_pop(&stack, &value)) {
        printf("Pop: %d\n", value);
    }
    printf("Empty: %zu\n", stack.count);
    return 0;
}
