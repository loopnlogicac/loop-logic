#include <stdio.h>

void minmax(const int *values, size_t n, int *low, int *high)
{
    int smallest = values[0], largest = values[0];
    for (size_t i = 1; i < n; i++) {
        if (values[i] < smallest) {
            smallest = values[i];
        }
        if (values[i] > largest) {
            largest = values[i];
        }
    }
    *low = smallest;
    *high = largest;
}

int main(void)
{
    int a[4], low, high;
    puts("Extrema inputs:");
    for (size_t i = 0; i < 4; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < -100 || a[i] > 100) {
            return 1;
        }
    }
    minmax(a, 4, &low, &high);
    printf("%d %d\n", low, high);
    return 0;
}
