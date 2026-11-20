#include <stdio.h>

int main(void)
{
    int n;
    int values[10];
    if (scanf("%d", &n) != 1 || n < 1 || n > 10) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            puts("invalid");
            return 0;
        }
    }
    for (int i = 1; i < n; ++i) {
        if (values[i - 1] > values[i]) {
            puts("invalid");
            return 0;
        }
    }
    int key;
    if (scanf("%d", &key) != 1) {
        puts("invalid");
        return 0;
    }
    int low = 0;
    int high = n - 1;
    int found = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (values[mid] == key) {
            found = mid;
            break;
        }
        if (values[mid] < key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    printf("%d\n", found);
    return 0;
}
