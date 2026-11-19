#include <stdio.h>

union Value { int count; double amount; };

int main(void)
{
    union Value value = {.count = 12};
    printf("Count: %d\n", value.count);
    value.amount = 25.5;
    printf("Amount: %.1f\n", value.amount);
    return 0;
}
