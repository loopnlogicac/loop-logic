#include <stdio.h>

int copy_cost(int pages)
{
    return pages * 3;
}

int main(void)
{
    printf("%d %d\n", copy_cost(12), copy_cost(7));
    return 0;
}
