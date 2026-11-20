#include <stdio.h>

static int fee_after_discount(int fee)
{
    /* Divide first because the fee is bounded and whole-taka rounding is intended. */
    return fee - fee / 10;
}

int main(void)
{
    int fee = 105;
    printf("Pay: %d\n", fee_after_discount(fee));
    return 0;
}
