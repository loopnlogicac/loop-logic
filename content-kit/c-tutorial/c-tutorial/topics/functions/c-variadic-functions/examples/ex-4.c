#include <stdio.h>
#include <stdarg.h>

void print_values(const char *types, ...)
{
    va_list arguments;
    va_start(arguments, types);
    for (int i = 0; types[i] != '\0'; i++) {
        if (types[i] == 'i') {
            printf("int:%d\n", va_arg(arguments, int));
        } else if (types[i] == 'd') {
            printf("double:%.1f\n", va_arg(arguments, double));
        }
    }
    va_end(arguments);
}

int main(void)
{
    print_values("idi", 7, 2.5, 9);
    return 0;
}
