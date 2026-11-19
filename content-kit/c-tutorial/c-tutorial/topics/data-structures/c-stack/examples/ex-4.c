#include <stdio.h>
#include "stack.h"

int main(void)
{
    struct ArrayStack stack = {0};
    for (int i = 0; i < STACK_CAPACITY; ++i) {
        if (!array_push(&stack, i)) {
            return 1;
        }
    }
    printf("Extra push: %d\n", array_push(&stack, 99));
    int value;
    while (array_pop(&stack, &value)) {
    }
    value = 77;
    printf("Empty pop: %d\n", array_pop(&stack, &value));
    printf("Retained: %d\n", value);
    return 0;
}
