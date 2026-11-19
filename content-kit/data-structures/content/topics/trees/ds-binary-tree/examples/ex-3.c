#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    int present[15] = {0}, a[15] = {0}, n;
    puts("Occupied count, then index/key pairs:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 15) {
        return 1;
    }
    for (int k = 0; k < n; k++) {
        int i, key;
        if (scanf("%d%d", &i, &key) != 2 || i < 0 || i >= 15 || present[i]) {
            return 1;
        }
        present[i] = 1;
        a[i] = key;
    }
    for (int i = 1; i < 15; i++) {
        if (present[i] && !present[(i - 1) / 2]) {
            puts("Invalid parent");
            return 0;
        }
    }
    for (int i = 0; i < 15; i++) {
        if (present[i]) {
            printf("index=%d key=%d\n", i, a[i]);
        }
    }
    return 0;
}
