#include <stdio.h>

int main(void)
{
    int n = 5;
    unsigned long long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= (unsigned long long)i;
    }
    printf("%llu\n", result);
    return 0;
}
