#include <stdio.h>

int *counter(void)
{
    static int count = 0;
    count++;
    return &count;
}

int main(void)
{
    int *first = counter();
    int before = *first;
    counter();
    printf("%d %d\n", before, *first);
    return 0;
}
