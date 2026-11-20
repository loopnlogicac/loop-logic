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
    for (int end = n - 1; end > 0; --end) {
        for (int i = 0; i < end; ++i) {
            if (values[i] > values[i + 1]) {
                int saved = values[i];
                values[i] = values[i + 1];
                values[i + 1] = saved;
            }
        }
    }
    for (int i = 0; i < n; ++i) {
        printf("%d%c", values[i], i + 1 == n ? '\n' : ' ');
    }
    return 0;
}
