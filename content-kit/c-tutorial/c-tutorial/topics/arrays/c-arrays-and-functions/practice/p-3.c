#include <stdio.h>

int keep_nonnegative(const int input[], int count, int output[])
{
    int used = 0;
    for (int i = 0; i < count; i++) {
        if (input[i] >= 0) {
            output[used++] = input[i];
        }
    }
    return used;
}

int main(void)
{
    int n;
    int values[20];
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }

    int output[20];
    int used = keep_nonnegative(values, n, output);
    for (int i = 0; i < used; i++) {
        printf("%s%d", i == 0 ? "" : " ", output[i]);
    }
    putchar('\n');
    return 0;
}
