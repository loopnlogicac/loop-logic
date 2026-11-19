#include <stdio.h>

int find(const int values[], int left, int right, int key)
{
    if (left > right) {
        return -1;
    }
    int middle = left + (right - left) / 2;
    if (values[middle] == key) {
        return middle;
    }
    if (key < values[middle]) {
        return find(values, left, middle - 1, key);
    }
    return find(values, middle + 1, right, key);
}

int main(void)
{
    int values[] = {4, 9, 15, 21, 33};
    printf("%d %d\n", find(values, 0, 4, 21), find(values, 0, 4, 8));
    return 0;
}
