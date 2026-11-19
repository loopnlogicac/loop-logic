#include <stdio.h>
#include <stdlib.h>

typedef struct { int weight, value, id; } Item;
static int ratio_order(const void *a, const void *b)
{
    const Item *x = a, *y = b;
    long long left = (long long)x->value * y->weight;
    long long right = (long long)y->value * x->weight;
    if (left != right) { return (right > left) - (right < left); }
    return (x->id > y->id) - (x->id < y->id);
}
static double fractional(Item a[], int n, int capacity)
{
    qsort(a, (size_t)n, sizeof a[0], ratio_order);
    double total = 0;
    for (int i = 0; i < n && capacity > 0; i++) {
        int take = a[i].weight < capacity ? a[i].weight : capacity;
        total += (double)take * a[i].value / a[i].weight;
        capacity -= take;
    }
    return total;
}

int main(void)
{
    Item a[] = {{10,60,0},{20,100,1},{30,120,2}};
    printf("value = %.2f\n", fractional(a, 3, 70));
    return 0;
}
