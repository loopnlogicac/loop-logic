#include <stdio.h>
int main(void)
{
    int n = 3;
#if defined(__STDC_NO_VLA__) && __STDC_NO_VLA__
    int values[3] = {0};
#else
    int values[n];
    for (int i = 0; i < n; i++) {
        values[i] = 0;
    }
#endif
    n = 5;
    printf("bound variable=%d elements=%zu\n", n, sizeof values / sizeof values[0]);
    return 0;
}
