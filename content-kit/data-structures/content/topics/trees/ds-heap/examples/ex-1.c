#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void swap(int *x, int *y)
{
    int t = *x;
    *x = *y;
    *y = t;
}
void sift_up(int heap[], int i)
{
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[parent] >= heap[i]) {
            break;
        }
        swap(&heap[parent], &heap[i]);
        i = parent;
    }
}
void sift_down(int heap[], int n, int i)
{
    while (2 * i + 1 < n) {
        int child = 2 * i + 1;
        if (child + 1 < n && heap[child + 1] > heap[child]) {
            child++;
        }
        if (heap[i] >= heap[child]) {
            break;
        }
        swap(&heap[i], &heap[child]);
        i = child;
    }
}
void build_heap(int heap[], int n)
{
    for (int i = n / 2; i > 0; i--) {
        sift_down(heap, n, i - 1);
    }
}
int read_array(int heap[], int *n)
{
    if (scanf("%d", n) != 1 || *n < 0 || *n > 12) {
        return 0;
    }
    for (int i = 0; i < *n; i++) {
        if (scanf("%d", &heap[i]) != 1 || heap[i] < -99 || heap[i] > 99) {
            return 0;
        }
    }
    return 1;
}
void print_heap(const int heap[], int n)
{
    printf("heap:");
    for (int i = 0; i < n; i++) {
        printf(" %d", heap[i]);
    }
    puts("");
}
int main(void)
{
    int heap[16], n;
    puts("Count and values:");
    if (!read_array(heap, &n)) {
        return 1;
    }
    int key, remove_max;
    puts("Insert key and remove-max flag (0/1):");
    if (scanf("%d%d", &key, &remove_max) != 2 || key < -99 || key > 99 || remove_max < 0 ||
        remove_max > 1) {
        return 1;
    }
    build_heap(heap, n);
    heap[n] = key;
    sift_up(heap, n);
    n++;
    if (remove_max) {
        int maximum = heap[0];
        heap[0] = heap[--n];
        sift_down(heap, n, 0);
        printf("removed=%d\n", maximum);
    }
    print_heap(heap, n);
    return 0;
}
