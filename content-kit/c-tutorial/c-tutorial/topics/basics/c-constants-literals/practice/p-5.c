#include <stdio.h>

#define FEE 5

int main(void)
{
    int count;
    printf("Input: ");
    if (scanf("%d", &count) != 1) {
        return 1;
    }
    const int unit_price = 12;
    int subtotal = count * unit_price;
    printf("Items=%d\nSubtotal=%d\nTotal=%d\n", count, subtotal, subtotal + FEE);
    return 0;
}
