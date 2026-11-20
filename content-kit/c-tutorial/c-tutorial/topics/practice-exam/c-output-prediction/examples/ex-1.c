#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int a = 7;
    int b = 2;
    printf("%.1f %.1f\n", (double)(a / b), (double)a / b);
    return 0;
}
