#include <stdio.h>

struct View { int *data; size_t count; };

int main(void)
{
    int marks[] = {10, 20};
    struct View first = {marks, 2};
    struct View second = first;
    second.data[0] = 99;
    printf("%d %d\n", first.data[0], second.data[0]);
    return 0;
}
