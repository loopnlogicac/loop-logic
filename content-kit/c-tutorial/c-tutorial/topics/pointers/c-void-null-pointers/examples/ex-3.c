#include <stdio.h>

void print_int(const void *data)
{
    const int *value = data;
    printf("%d\n", *value);
}

int main(void)
{
    int value = 16;
    print_int(&value);
    return 0;
}
