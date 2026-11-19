#include <stdio.h>



int main(void)
{
    int n;
    int values[10];
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }

    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
