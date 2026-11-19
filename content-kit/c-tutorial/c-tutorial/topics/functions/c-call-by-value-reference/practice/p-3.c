#include <stdio.h>

void rotate(int *a, int *b, int *c)
{
    int last = *c;
    *c = *b;
    *b = *a;
    *a = last;
}

int main(void)
{
    int a, b, c;
    puts("Rolls:");
    if (scanf("%d%d%d", &a, &b, &c) != 3 || a < 0 || a > 100 ||
        b < 0 || b > 100 || c < 0 || c > 100) {
        return 1;
    }
    rotate(&a, &b, &c);
    printf("%d %d %d\n", a, b, c);
    return 0;
}
