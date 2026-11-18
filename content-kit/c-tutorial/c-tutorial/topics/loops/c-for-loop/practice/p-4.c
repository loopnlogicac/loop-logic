#include <stdio.h>

int main(void)
{
    int a, b;
    int found = 0;

    if (scanf("%d %d", &a, &b) != 2 || a < 0 || b < a || b > 10000) {
        return 1;
    }
    for (int n = (a < 2 ? 2 : a); n <= b; n++) {
        int is_prime = 1;
        for (int d = 2; d * d <= n; d++) {
            if (n % d == 0) {
                is_prime = 0;
                break;
            }
        }
        if (is_prime) {
            printf("%d ", n);
            found++;
        }
    }
    if (found == 0) {
        printf("No primes");
    }
    printf("\n");
    return 0;
}
