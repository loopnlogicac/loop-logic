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
    int n, chosen[16];
    Activity a[16];
    puts("Enter n and start finish pairs:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d%d", &a[i].start, &a[i].finish) != 2 || a[i].start < 0 ||
            a[i].finish <= a[i].start || a[i].finish > 100) { return 1; }
        a[i].id = i;
    }
    int count = select_activities(a, n, chosen);

    printf("selected:");
    for (int i = 0; i < count; i++) { printf(" %d", chosen[i]); }
    putchar('\n');
    return 0;
}
