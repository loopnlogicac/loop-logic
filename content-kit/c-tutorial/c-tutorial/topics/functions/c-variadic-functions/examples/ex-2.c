#include <stdio.h>
#include <stdarg.h>

double average_values(int count, ...)
{
    if (count <= 0) {
        return 0.0;
    }
    va_list arguments;
    va_start(arguments, count);
    double total = 0.0;
    for (int i = 0; i < count; i++) {
        total += va_arg(arguments, double);
    }
    va_end(arguments);
    return total / count;
}

int main(void)
{
    float first = 2.5f;
    printf("%.2f\n", average_values(3, first, 4.0, 7.0));
    return 0;
}
