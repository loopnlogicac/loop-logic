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
    Job jobs[] = {{1,100,0},{1,19,1},{1,27,2},{1,25,3},{1,15,4}};
    int slots[5];
    printf("profit = %d\n", schedule(jobs, 5, slots));
    for (int i = 0; i < 5; i++) { printf("%s%d", i ? " " : "", slots[i]); }
    putchar('\n');
    return 0;
}
