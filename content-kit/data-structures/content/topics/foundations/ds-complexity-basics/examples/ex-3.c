#include <stdio.h>

int main(void)
{
    int size = 0;
    int capacity = 1;
    int copies = 0;
    for (int value = 1; value <= 9; value++) {
        if (size == capacity) {
            copies += size;
            capacity *= 2;
        }
        size++;
        printf("size=%d capacity=%d copies=%d\n", size, capacity, copies);
    }
    return 0;
}
