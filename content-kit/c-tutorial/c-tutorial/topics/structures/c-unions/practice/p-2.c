#include <stdio.h>

union Value { int count; double amount; };

int main(void)
{
    int amount;
    puts("Whole taka:");
    if (scanf("%d", &amount) != 1 || amount < 0 || amount > 10000) {
        return 1;
    }
    union Value value = {.amount = (double)amount};
    printf("%.1f\n", value.amount);
    return 0;
}
