#include <stdio.h>

int main(void)
{
    int values[2] = {5, 8};
    int *end = values + 2;
    printf("%d\n", *end);
    return 0;
}
