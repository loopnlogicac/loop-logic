#include <stdio.h>

int main(void)
{
    double amount;
    printf("Input: ");
    if (scanf("%lf", &amount) != 1) {
        return 1;
    }
    printf("Taka=%.2f\n", amount);
    return 0;
}
