#include <stdio.h>

int main(void)
{
    int *address = 3.5;
    printf("%p\n", (void *)address);
    return 0;
}
