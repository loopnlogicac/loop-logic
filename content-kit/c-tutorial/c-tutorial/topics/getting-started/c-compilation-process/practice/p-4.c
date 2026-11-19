#include <stdio.h>

#define FEE 5

int main(void)
{
    int quantity, price;
    printf("Input: ");
    if (scanf("%d %d", &quantity, &price) != 2) {
        return 1;
    }
    printf("Bill=%d\n", quantity * price + FEE);
    return 0;
}
