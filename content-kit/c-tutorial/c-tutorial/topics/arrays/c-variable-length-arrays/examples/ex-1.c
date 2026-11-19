#include <stdio.h>
int main(void)
{
    int n;
    puts("Length from 1 to 8:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 8) {
        return 1;
    }
#if defined(__STDC_NO_VLA__) && __STDC_NO_VLA__
    int values[8];
#else
    int values[n];
#endif
    for (int i = 0; i < n; i++) {
        values[i] = (i + 1) * (i + 1);
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
