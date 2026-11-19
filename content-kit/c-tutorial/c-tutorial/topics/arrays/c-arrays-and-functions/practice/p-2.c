#include <stdio.h>

void prefix_sums(const int input[], int output[], int count)
{
    int sum = 0;
    for (int i = 0; i < count; i++) {
        sum += input[i];
        output[i] = sum;
    }
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
    prefix_sums(values, output, n);
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", output[i]);
    }
    putchar('\n');
    return 0;
}
