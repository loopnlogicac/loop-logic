#include <stdio.h>
#include <stdarg.h>

void show_twice(int count, ...)
{
    va_list first, second;
    va_start(first, count);
    va_copy(second, first);
    int sum = 0;
    int product = 1;
    for (int i = 0; i < count; i++) {
        sum += va_arg(first, int);
        product *= va_arg(second, int);
    }
    va_end(second);
    va_end(first);
    printf("%d %d\n", sum, product);
}

int main(void)
{
    int a, b, c;
    puts("Three factors:");
    if (scanf("%d%d%d", &a, &b, &c) != 3 || a < 0 || a > 10 ||
        b < 0 || b > 10 || c < 0 || c > 10) {
        return 1;
    }
    show_twice(3, a, b, c);
    return 0;
}
