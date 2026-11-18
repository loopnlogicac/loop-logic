#include <stdio.h>

int main(void)
{
    int value;
    printf("Input: ");
    if (scanf("%d", &value) != 1) {
        return 1;
    }
    printf("Product=%d\n", 3 * value);
    return 0;
}
