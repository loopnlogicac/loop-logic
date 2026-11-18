#include <stdio.h>

int main(void)
{
    int a, b, c;
    printf("Input: ");
    if (scanf("%d %d %d", &a, &b, &c) != 3 || a < 0 || a > 9999 || b < 0 || b > 9999 || c < 0
        || c > 9999) {
        return 1;
    }
    int best = a > b ? a : b;
    best = best > c ? best : c;
    printf("%d\n", best);
    return 0;
}
