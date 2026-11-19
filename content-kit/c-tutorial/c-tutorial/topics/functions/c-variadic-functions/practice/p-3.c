#include <stdio.h>
#include <stdarg.h>

int maximum(int count, ...)
{
    va_list arguments;
    va_start(arguments, count);
    int best = va_arg(arguments, int);
    for (int i = 1; i < count; i++) {
        int value = va_arg(arguments, int);
        if (value > best) {
            best = value;
        }
    }
    va_end(arguments);
    return best;
}

int main(void)
{
    int a, b, c, d;
    puts("Four values:");
    if (scanf("%d%d%d%d", &a, &b, &c, &d) != 4 || a < -100 || a > 100 ||
        b < -100 || b > 100 || c < -100 || c > 100 || d < -100 || d > 100) {
        return 1;
    }
    printf("%d\n", maximum(4, a, b, c, d));
    return 0;
}
