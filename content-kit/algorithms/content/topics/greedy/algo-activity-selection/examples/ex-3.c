#include <stdio.h>
#include <stdlib.h>

typedef struct { int start, finish, id; } Activity;
static int finish_order(const void *a, const void *b)
{
    const Activity *x = a, *y = b;
    if (x->finish != y->finish) {
        return (x->finish > y->finish) - (x->finish < y->finish);
    }
    return (x->id > y->id) - (x->id < y->id);
}
static int select_activities(Activity a[], int n, int chosen[])
{
    qsort(a, (size_t)n, sizeof a[0], finish_order);
    int count = 0, last = 0;
    for (int i = 0; i < n; i++) {
        if (count == 0 || a[i].start >= last) {
            chosen[count++] = a[i].id;
            last = a[i].finish;
        }
    }
    return count;
}

int main(void)
{
    Activity a[] = {{0,20,0},{1,2,1},{2,3,2},{3,4,3},{4,5,4},{5,6,5}};
    int chosen[6], count = select_activities(a, 6, chosen);
    printf("count = %d\n", count);
    for (int i = 0; i < count; i++) { printf("%s%d", i ? " " : "", chosen[i]); }
    putchar('\n');
    return 0;
}
