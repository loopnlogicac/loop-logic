#include <stdio.h>



int main(void)
{
    int n;
    int values[20];
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 20) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < 0 || values[i] > 100) {
            return 1;
        }
    }

    int sum = 0, minimum = values[0], maximum = values[0];
    for (int i = 0; i < n; i++) {
        sum += values[i];
        if (values[i] < minimum) {
            minimum = values[i];
        }
        if (values[i] > maximum) {
            maximum = values[i];
        }
    }
    printf("sum=%d average=%.2f min=%d max=%d\n",
           sum, (double)sum / n, minimum, maximum);
    return 0;
}
