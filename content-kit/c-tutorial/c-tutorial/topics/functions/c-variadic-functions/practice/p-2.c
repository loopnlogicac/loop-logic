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
    double a, b;
    puts("Decimal pair:");
    if (scanf("%lf%lf", &a, &b) != 2 || !(a >= -100 && a <= 100) ||
        !(b >= -100 && b <= 100)) {
        return 1;
    }
    printf("%.2f\n", average_values(2, a, b));
    return 0;
}
