#include <stdio.h>

static void prepare(int a[], int n)
{
    for (int i = 1; i < n; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}
static int binary_search(const int a[], int n, int target)
{
    int low = 0;
    int high = n;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (a[mid] == target) {
            return mid;
        }
        if (a[mid] < target) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return -1;
}

int main(void)
{
    int values[] = {7, 3, 5, 3, 1};
    int a[5];
    for (int i = 0; i < 5; i++) {
        a[i] = values[i];
    }
    prepare(a, 5);
    printf("index = %d\n", binary_search(a, 5, 5));
    return 0;
}
