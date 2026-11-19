#include <stdio.h>
#include <stdint.h>

int main(void)
{
    size_t count;
    puts("Element count:");
    if (scanf("%zu", &count) != 1) {
        return 1;
    }
    int *values = NULL;
    if (count > SIZE_MAX / sizeof *values) {
        puts("overflow");
    } else {
        printf("%zu\n", count * sizeof *values);
    }
    return 0;
}
