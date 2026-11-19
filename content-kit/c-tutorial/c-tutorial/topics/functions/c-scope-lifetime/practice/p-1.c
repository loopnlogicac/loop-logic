#include <stdio.h>



int main(void)
{
    int price, inner_input;
    puts("Two prices:");
    if (scanf("%d%d", &price, &inner_input) != 2 || price < 0 || price > 1000 ||
        inner_input < 0 || inner_input > 1000) {
        return 1;
    }
    {
        int price = inner_input;
        printf("%d\n", price);
    }
    printf("%d\n", price);
    return 0;
}
