#include <stdio.h>

static int linear_search(const int a[], int n, int target)
{
    for (int i = 0; i < n; i++) {
        if (a[i] == target) {
            return i;
        }
    }
    return -1;
}

int main(void)
{
    int a[] = {7, 3, 5, 3, 1};
    printf("index = %d\n", linear_search(a, 5, 5));
    return 0;
}
