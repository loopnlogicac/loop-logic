#include <stdio.h>

static void swap(int *x, int *y)
{
    int saved = *x;
    *x = *y;
    *y = saved;
}
static void show(const int a[], int n)
{
    for (int i = 0; i < n; i++) {
        printf("%s%d", i ? " " : "", a[i]);
    }
    puts("");
}

int main(void)
{
    int a[] = {7, 3, 5, 3, 1};
    int swaps = 0;
    for (int j = 0; j < 4; j++) {
        if (a[j] > a[j + 1]) {
            swap(&a[j], &a[j + 1]);
            swaps++;
        }
    }
    show(a, 5);
    printf("swaps = %d\n", swaps);
    return 0;
}
