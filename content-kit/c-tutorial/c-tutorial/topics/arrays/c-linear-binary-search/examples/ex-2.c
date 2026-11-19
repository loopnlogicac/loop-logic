#include <stdio.h>

int binary(const int values[], int count, int key)
{
    int low = 0, high = count;
    while (low < high) {
        int middle = low + (high - low) / 2;
        if (values[middle] == key) {
            return middle;
        }
        if (values[middle] < key) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }
    return -1;
}

int main(void)
{
    int rolls[] = {8, 11, 25, 40, 63, 77};
    printf("%d %d\n", binary(rolls, 6, 63), binary(rolls, 6, 7));
    return 0;
}
