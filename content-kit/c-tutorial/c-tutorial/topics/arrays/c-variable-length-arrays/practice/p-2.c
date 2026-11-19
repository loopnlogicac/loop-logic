#include <stdio.h>
int main(void)
{
    int n;
    puts("Bounded length and values:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 16) {
        return 1;
    }
#if defined(__STDC_NO_VLA__) && __STDC_NO_VLA__
    int values[16];
#else
    int values[n];
#endif
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }
    for (int i = n - 1; i >= 0; i--) {
        printf("%s%d", i == n - 1 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
