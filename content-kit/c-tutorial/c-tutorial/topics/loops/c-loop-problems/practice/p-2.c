#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 60) {
        return 1;
    }
    unsigned long long a = 0;
    unsigned long long b = 1;
    for (int i = 0; i < n; i++) {
        if (i > 0) {
            printf(" ");
        }
        printf("%llu", a);
        unsigned long long next = a + b;
        a = b;
        b = next;
    }
    puts("");
    return 0;
}
