#include <stdio.h>

static int sentinel_search(int a[], int n, int target)
{
    /* The caller reserves a[n] as a writable extra slot. */
    a[n] = target;
    int i = 0;
    while (a[i] != target) {
        i++;
    }
    return i < n ? i : -1;
}

int main(void)
{
    int a[6] = {7, 3, 5, 3, 1};
    printf("index = %d\n", sentinel_search(a, 5, 8));
    return 0;
}
