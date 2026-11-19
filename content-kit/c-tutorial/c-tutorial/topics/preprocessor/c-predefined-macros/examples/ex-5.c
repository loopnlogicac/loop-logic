#include <stdio.h>

int main(void)
{
    printf("Date length: %zu Time length: %zu\n", sizeof __DATE__ - 1, sizeof __TIME__ - 1);
    return 0;
}
