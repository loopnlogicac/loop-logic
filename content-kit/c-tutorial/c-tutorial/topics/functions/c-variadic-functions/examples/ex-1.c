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
    printf("%d %d\n", sum_ints(3, 12, 8, 5), sum_ints(0));
    return 0;
}
