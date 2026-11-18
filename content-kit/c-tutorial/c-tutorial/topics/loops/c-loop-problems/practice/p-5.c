#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 999999) {
        return 1;
    }
    int original = n;
    int copy = n;
    int digits = 0;
    do {
        digits++;
        copy /= 10;
    } while (copy > 0);
    int sum = 0;
    do {
        int digit = n % 10;
        int power = 1;
        for (int i = 0; i < digits; i++) {
            power *= digit;
        }
        sum += power;
        n /= 10;
    } while (n > 0);
    printf("%d\n", sum == original);
    return 0;
}
