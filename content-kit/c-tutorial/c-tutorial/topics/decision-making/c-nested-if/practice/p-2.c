#include <stdio.h>

int main(void)
{
    int a, b, c;
    printf("Input: ");
    if (scanf("%d %d %d", &a, &b, &c) != 3 || a < -100 || a > 100 || b < -100 || b > 100
        || c < -100 || c > 100) {
        return 1;
    }
    int best = a;
    if (b > best) {
        best = b;
    }
    if (c > best) {
        best = c;
    }
    printf("%d\n", best);
    return 0;
}
