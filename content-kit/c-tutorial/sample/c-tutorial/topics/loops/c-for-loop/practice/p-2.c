#include <stdio.h>

int main(void)
{
    int n;
    unsigned long long factorial = 1;

    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        printf("n must be between 0 and 20\n");
        return 1;
    }
    for (int i = 2; i <= n; i++) {
        factorial *= (unsigned long long)i;
    }
    printf("%d! = %llu\n", n, factorial);
    return 0;
}
