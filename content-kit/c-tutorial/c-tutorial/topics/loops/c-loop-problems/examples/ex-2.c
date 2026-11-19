#include <stdio.h>

int main(void)
{
    int n = 8;
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
