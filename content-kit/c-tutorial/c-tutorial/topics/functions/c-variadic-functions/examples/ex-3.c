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
    show_twice(3, 2, 3, 4);
    return 0;
}
