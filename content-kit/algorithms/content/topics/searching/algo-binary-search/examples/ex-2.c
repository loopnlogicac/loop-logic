#include <stdio.h>

static int recursive_search(const int a[], int low, int high, int target)
{
    if (low >= high) {
        return -1;
    }
    int mid = low + (high - low) / 2;
    if (a[mid] == target) {
        return mid;
    }
    if (a[mid] < target) {
        return recursive_search(a, mid + 1, high, target);
    }
    return recursive_search(a, low, mid, target);
}

int main(void)
{
    int a[] = {1, 3, 3, 5, 7};
    printf("index = %d\n", recursive_search(a, 0, 5, 5));
    return 0;
}
