#include <stdio.h>

int main(void)
{
    int n;
    long long sum = 0;

    printf("Enter a positive number: ");
    if (scanf("%d", &n) != 1 || n < 1) {
        printf("Please enter a positive whole number.\n");
        return 1;
    }

    for (int i = 1; i <= n; i++) {
        sum += i; /* add 1, then 2, then 3 ... up to n */
    }

    printf("Sum of 1 to %d = %lld\n", n, sum);
    return 0;
}
