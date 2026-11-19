#include <stdio.h>

int main(void)
{
    int n = 29;
    int prime = n >= 2;
    for (int d = 2; prime && d <= n / d; d++) {
        if (n % d == 0) {
            prime = 0;
        }
    }
    printf("%d\n", prime);
    return 0;
}
