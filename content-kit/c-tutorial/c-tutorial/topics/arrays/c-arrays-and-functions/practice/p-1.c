#include <stdio.h>

int array_sum(const int values[], int count)
{
    int sum = 0;
    for (int i = 0; i < count; i++) {
        sum += values[i];
    }
    return sum;
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

    printf("%d\n", array_sum(values, n));
    return 0;
}
