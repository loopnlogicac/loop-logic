#include <stdio.h>

int main(void)
{
    int a[4], index, value;
    puts("Values, index and replacement:");
    for (size_t i = 0; i < 4; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < -100 || a[i] > 100) {
            return 1;
        }
    }
    if (scanf("%d %d", &index, &value) != 2 || index < 0 || index > 3 ||
        value < -100 || value > 100) {
        return 1;
    }
    *(a + index) = value;
    for (size_t i = 0; i < 4; i++) {
        printf("%s%d", i == 0 ? "" : " ", a[i]);
    }
    putchar('\n');
    return 0;
}
