#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int read_array(int heap[], int *n)
{
    if (scanf("%d", n) != 1 || *n < 0 || *n > 12) {
        return 0;
    }
    for (int i = 0; i < *n; i++) {
        if (scanf("%d", &heap[i]) != 1 || heap[i] < -99 || heap[i] > 99) {
            return 0;
        }
    }
    return 1;
}

int main(void)
{
    int heap[16], n;
    puts("Count and values:");
    if (!read_array(heap, &n)) {
        return 1;
    }
    int valid = 1;
    for (int i = 1; i < n; i++) {
        if (heap[(i - 1) / 2] < heap[i]) {
            valid = 0;
        }
    }
    printf("valid=%d\n", valid);
    return 0;
}
