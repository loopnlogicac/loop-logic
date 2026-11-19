#include <stdio.h>
#include <stdlib.h>

typedef struct { int deadline, profit, id; } Job;
static int profit_order(const void *a, const void *b)
{
    const Job *x = a, *y = b;
    if (x->profit != y->profit) {
        return (y->profit > x->profit) - (y->profit < x->profit);
    }
    return (x->id > y->id) - (x->id < y->id);
}
static int schedule(Job jobs[], int n, int slots[])
{
    qsort(jobs, (size_t)n, sizeof jobs[0], profit_order);
    for (int i = 0; i < n; i++) { slots[i] = -1; }
    int total = 0;
    for (int i = 0; i < n; i++) {
        if (jobs[i].profit <= 0) { continue; }
        int last = jobs[i].deadline < n ? jobs[i].deadline : n;
        for (int slot = last - 1; slot >= 0; slot--) {
            if (slots[slot] == -1) {
                slots[slot] = jobs[i].id;
                total += jobs[i].profit;
                break;
            }
        }
    }
    return total;
}

int main(void)
{
    int n, slots[16];
    Job jobs[16];
    puts("Enter n and deadline profit pairs:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d%d", &jobs[i].deadline, &jobs[i].profit) != 2 ||
            jobs[i].deadline < 0 || jobs[i].deadline > 100 ||
            jobs[i].profit < -99 || jobs[i].profit > 999) { return 1; }
        jobs[i].id = i;
    }
    int total = schedule(jobs, n, slots);
    printf("profit = %d\n", total);
    return 0;
}
