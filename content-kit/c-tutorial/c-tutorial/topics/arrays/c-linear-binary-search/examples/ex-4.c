#include <stdio.h>



int main(void)
{
    int values[] = {1, 3, 5, 7, 9, 11, 13, 15};
    int low = 0, high = 8, probes = 0, key = 2;
    while (low < high) {
        int middle = low + (high - low) / 2;
        probes++;
        printf("[%d,%d) middle=%d\n", low, high, middle);
        if (values[middle] < key) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }
    printf("probes=%d\n", probes);
    return 0;
}
