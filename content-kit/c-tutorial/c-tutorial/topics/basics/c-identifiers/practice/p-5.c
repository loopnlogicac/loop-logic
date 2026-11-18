#include <stdio.h>

int main(void)
{
    int item_count, unit_price;
    printf("Input: ");
    if (scanf("%d %d", &item_count, &unit_price) != 2) {
        return 1;
    }
    int subtotal = item_count * unit_price;
    printf("subtotal=%d\nwith_fee=%d\n", subtotal, subtotal + 5);
    return 0;
}
