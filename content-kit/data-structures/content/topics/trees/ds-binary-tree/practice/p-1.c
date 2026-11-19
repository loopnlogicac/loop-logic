#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    int n, a[12];
    puts("Count and keys:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &a[i]) != 1) {
            return 1;
        }
    }
    printf("leaves:");
    for (int i = n / 2; i < n; i++) {
        printf(" %d", a[i]);
    }
    puts("");
    return 0;
}
