#include <stdio.h>

int main(void)
{
    int a[4];
    puts("Reverse four:");
    for (size_t i = 0; i < 4; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < -100 || a[i] > 100) {
            return 1;
        }
    }
    int *left = a;
    int *right = a + 3;
    while (left < right) {
        int temp = *left;
        *left++ = *right;
        *right-- = temp;
    }
    for (size_t i = 0; i < 4; i++) {
        printf("%s%d", i == 0 ? "" : " ", a[i]);
    }
    putchar('\n');
    return 0;
}
