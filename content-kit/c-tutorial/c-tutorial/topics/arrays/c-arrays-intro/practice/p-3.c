#include <stdio.h>



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

    int sum = 0;
    for (int i = 0; i < n; i += 2) {
        sum += values[i];
    }
    printf("%d\n", sum);
    return 0;
}
