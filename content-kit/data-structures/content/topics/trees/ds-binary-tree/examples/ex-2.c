#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    int a[] = {8, 3, 10, 1, 6, 9};
    int n = 6;
    for (int i = 0; i < n; i++) {
        printf("index=%d key=%d parent=%d left=%d right=%d\n", i, a[i], i == 0 ? -1 : (i - 1) / 2,
               2 * i + 1 < n ? 2 * i + 1 : -1, 2 * i + 2 < n ? 2 * i + 2 : -1);
    }
    return 0;
}
