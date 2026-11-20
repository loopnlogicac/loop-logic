#include <stdio.h>

int main(void)
{
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 30000) {
        puts("invalid");
        return 0;
    }
    int prime = n >= 2;
    for (int d = 2; prime && d <= n / d; ++d) {
        if (n % d == 0) {
            prime = 0;
        }
    }
    puts(prime ? "prime" : "not prime");
    return 0;
}
