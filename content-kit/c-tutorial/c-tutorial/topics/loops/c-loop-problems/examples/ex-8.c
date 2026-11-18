#include <stdio.h>

int main(void)
{
    int n = 6;
    int sum = 0;
    for (int divisor = 1; divisor <= n / 2; divisor++) {
        if (n % divisor == 0) {
            sum += divisor;
        }
    }
    printf("%d\n", n > 1 && sum == n);
    return 0;
}
