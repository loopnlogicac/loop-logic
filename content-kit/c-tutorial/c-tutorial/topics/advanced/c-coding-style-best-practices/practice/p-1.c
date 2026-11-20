#include <stdio.h>

static int amount_due(int price)
{
    return price - price / 10;
}

int main(void)
{
    int price;
    if (scanf("%d", &price) != 1 || price < 0 || price > 10000) {
        puts("invalid");
        return 0;
    }
    printf("%d\n", amount_due(price));
    return 0;
}
