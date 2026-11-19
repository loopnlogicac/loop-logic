#include <stdio.h>

int main(void)
{
    int *rows[2];
    int value = 8;
    rows[0] = &value;
    printf("%d\n", *rows[1]);
    return 0;
}
