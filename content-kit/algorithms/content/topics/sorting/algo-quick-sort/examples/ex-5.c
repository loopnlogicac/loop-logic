#include <stdio.h>
#include <stdint.h>

static void swap(int *x, int *y)
{
    int saved = *x;
    *x = *y;
    *y = saved;
}
static uint32_t state = UINT32_C(123456789);
static uint32_t next_random(void)
{
    state = UINT32_C(1664525) * state + UINT32_C(1013904223);
    return state;
}
static int random_index(int low, int high)
{
    uint32_t width = (uint32_t)(high - low + 1);
    uint32_t threshold = (UINT32_C(0) - width) % width;
    uint32_t value;
    do {
        value = next_random();
    } while (value < threshold);
    return low + (int)(value % width);
}
static void random_sort(int a[], int low, int high)
{
    if (low >= high) {
        return;
    }
    swap(&a[random_index(low, high)], &a[high]);
    int pivot = a[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if (a[j] <= pivot) {
            swap(&a[i++], &a[j]);
        }
    }
    swap(&a[i], &a[high]);
    random_sort(a, low, i - 1);
    random_sort(a, i + 1, high);
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
    random_sort(a, 0, 4);
    show(a, 5);
    return 0;
}
