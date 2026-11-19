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
    int values[] = {2, 4, 4, 4, 9};
    int position = lower_bound(values, 5, 4);
    printf("%d\n", position);
    return 0;
}
