#include <stdio.h>

int main(void)
{
    int a[3] = {1, 2, 3};
    int *p = a;
    printf("array=%zu pointer=%zu element=%zu\n", sizeof a, sizeof p, sizeof a[0]);
    return 0;
}
