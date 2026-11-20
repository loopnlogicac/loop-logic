#include <stdio.h>

int main(void)
{
    int n;
    int values[10];
    if (scanf("%d", &n) != 1 || n < 1 || n > 10) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            puts("invalid");
            return 0;
        }
    }
    int best = values[0];
    for (int i = 1; i < n; ++i) {
        if (values[i] > best) {
            best = values[i];
        }
    }
    printf("%d\n", best);
    return 0;
}
