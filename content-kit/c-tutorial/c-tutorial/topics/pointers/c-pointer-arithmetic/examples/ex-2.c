#include <stdio.h>
#include <stddef.h>

int main(void)
{
    int seats[5] = {0};
    int *first = &seats[1];
    int *last = &seats[4];
    ptrdiff_t distance = last - first;
    printf("%td %d\n", distance, first < last);
    return 0;
}
