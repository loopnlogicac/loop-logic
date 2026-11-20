#include <stdio.h>

int main(void)
{
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        puts("invalid");
        return 0;
    }
    long a = 0;
    long b = 1;
    for (int i = 0; i < n; ++i) {
        long next = a + b;
        a = b;
        b = next;
    }
    printf("%ld\n", a);
    return 0;
}
