#include <stdio.h>
#include <stdlib.h>
#include "stack.h"

int main(void)
{
    struct StackNode *top = NULL;
    if (!linked_push(&top, 4) || !linked_push(&top, 9)) {
        linked_clear(&top);
        return EXIT_FAILURE;
    }
    int value;
    if (linked_peek(top, &value)) {
        printf("Top: %d\n", value);
    }
    while (linked_pop(&top, &value)) {
        printf("Removed: %d\n", value);
    }
    linked_clear(&top);
    printf("Released: %d\n", top == NULL);
    return 0;
}
