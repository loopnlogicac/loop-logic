#include <stdio.h>
#include <stdlib.h>

static int bucket(int key, int size)
{
    int r = key % size;
    return r < 0 ? r + size : r;
}

int main(void)
{
    int n, counts[11] = {0};
    puts("Count and keys:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) { return 1; }
    for (int i = 0; i < n; i++) {
        int key;
        if (scanf("%d", &key) != 1) { return 1; }
        int index = bucket(key, 11);
        counts[index]++;
        printf("%d -> %d\n", key, index);
    }
    int collisions = 0;
    for (int i = 0; i < 11; i++) {
        if (counts[i] > 1) { collisions += counts[i] - 1; }
    }
    printf("collisions=%d\n", collisions);
    return 0;
}
