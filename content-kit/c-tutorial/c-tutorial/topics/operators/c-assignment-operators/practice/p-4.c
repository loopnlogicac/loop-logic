#include <stdio.h>

int main(void)
{
    int price, count, fee, discount;
    printf("Input: ");
    if (scanf("%d %d %d %d", &price, &count, &fee, &discount) != 4 || price < 0 || price > 100
        || count < 0 || count > 100
        || fee < 0 || fee > 100 || discount < 0 || discount > 100) {
        return 1;
    }
    price *= count;
    price += fee;
    price -= discount;
    printf("%d\n", price);
    return 0;
}
