#include <stdio.h>

static void swap(int *x, int *y)
{
    int saved = *x;
    *x = *y;
    *y = saved;
}

int main(void)
{
    int a[] = {1, 2, 3, 4, 5};
    int comparisons = 0;
    int swaps = 0;
    for (int i = 0; i < 4; i++) {
        int min = i;
        for (int j = i + 1; j < 5; j++) {
            comparisons++;
            if (a[j] < a[min]) {
                min = j;
            }
        }
        if (min != i) {
            swap(&a[i], &a[min]);
            swaps++;
        }
    }
    printf("comparisons = %d, swaps = %d\n", comparisons, swaps);
    return 0;
}
