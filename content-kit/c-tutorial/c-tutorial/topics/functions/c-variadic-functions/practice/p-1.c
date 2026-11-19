#include <stdio.h>
#include <stdarg.h>

int sum_ints(int count, ...)
{
    va_list arguments;
    va_start(arguments, count);
    int total = 0;
    for (int i = 0; i < count; i++) {
        total += va_arg(arguments, int);
    }
    va_end(arguments);
    return total;
}

int main(void)
{
    int a, b, c;
    puts("Marks to add:");
    if (scanf("%d%d%d", &a, &b, &c) != 3 || a < 0 || a > 100 ||
        b < 0 || b > 100 || c < 0 || c > 100) {
        return 1;
    }
    printf("%d\n", sum_ints(3, a, b, c));
    return 0;
}
