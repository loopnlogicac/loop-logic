#include <stdio.h>

#define FEE 5

int main(void)
{
    int subtotal;
    printf("Input: ");
    if (scanf("%d", &subtotal) != 1) {
        return 1;
    }
    printf("Bill=%d\n", subtotal + FEE);
    return 0;
}
