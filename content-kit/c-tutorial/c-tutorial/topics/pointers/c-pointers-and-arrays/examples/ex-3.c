#include <stdio.h>

int sum(const int *p, size_t count)
{
    int total = 0;
    for (size_t i = 0; i < count; i++) {
        total += *(p + i);
    }
    return total;
}

int main(void)
{
    int a[] = {4, 5, 6, 7};
    size_t n = sizeof a / sizeof a[0];
    printf("count=%zu total=%d\n", n, sum(a, n));
    return 0;
}
