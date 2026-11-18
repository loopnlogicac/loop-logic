#include <stdio.h>

int main(void)
{
    int price, fee;
    printf("Input: ");
    if (scanf("%d %d", &price, &fee) != 2 || price < 0 || price > 1000 || fee < 0 || fee > 1000) {
        return 1;
    }
    printf("Total=%d\n", price + fee);
    return 0;
}
