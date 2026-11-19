#include <stdio.h>
#include <stdlib.h>

int read_count(void)
{
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        exit(EXIT_FAILURE);
    }
    return n;
}

int main(void)
{
    int n = read_count();
    int capacity = 1;
    int copies = 0;
    for (int size = 0; size < n; size++) {
        if (size == capacity) {
            copies += size;
            capacity *= 2;
        }
    }
    printf("Copies: %d\n", copies);
    return 0;
}
