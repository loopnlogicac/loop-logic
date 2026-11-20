#include <stdio.h>

int main(void)
{
    int first = 10;
    int second = 20;
    const int *view = &first;
    int *const owner = &first;
    view = &second;
    *owner = 15;
    printf("Viewed: %d\n", *view);
    printf("Owned: %d\n", *owner);
    return 0;
}
