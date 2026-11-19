#include <stdio.h>
#include "stack.h"

int main(void)
{
    int n;
    struct ArrayStack stack = {0};
    if (scanf("%d", &n) != 1 || n < 0 || n > STACK_CAPACITY) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < n; ++i) {
        int value;
        if (scanf("%d", &value) != 1 || value < -100 || value > 100 ||
            !array_push(&stack, value)) {
            puts("invalid");
            return 0;
        }
    }
    int value;
    while (array_pop(&stack, &value)) {
        printf("%d\n", value);
    }
    return 0;
}
