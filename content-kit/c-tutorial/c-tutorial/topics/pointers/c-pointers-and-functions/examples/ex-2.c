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
    int scores[] = {70, 40, 90};
    int low, high;
    minmax(scores, 3, &low, &high);
    printf("%d %d\n", low, high);
    return 0;
}
