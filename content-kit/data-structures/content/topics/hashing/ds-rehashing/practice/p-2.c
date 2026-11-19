#include <stdio.h>
#include <stdlib.h>


int main(void)
{
    int n;
    size_t capacity = 5;
    puts("Number of distinct keys (0..1000):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 1000) { return 1; }
    for (int count = 1; count <= n; count++) {
        if ((size_t)count * 10 > capacity * 6) { capacity = capacity * 2 + 1; }
    }
    printf("capacity=%zu\n", capacity);
    return 0;
}
