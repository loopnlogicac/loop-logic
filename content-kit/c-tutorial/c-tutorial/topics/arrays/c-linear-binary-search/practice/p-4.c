#include <stdio.h>

int lower_bound(const int values[], int count, int key)
{
    int low = 0, high = count;
    while (low < high) {
        int middle = low + (high - low) / 2;
        if (values[middle] < key) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }
    return low;
}

int main(void)
{
    int n;
    int values[20];
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }
    int key;
    puts("Search key:");
    if (scanf("%d", &key) != 1 || key < -100 || key > 100) {
        return 1;
    }
    for (int i = 1; i < n; i++) {
        if (values[i - 1] > values[i]) {
            return 1;
        }
    }
    printf("%d\n", lower_bound(values, n, key));
    return 0;
}
