#include <stdio.h>
#include <stdlib.h>

struct Record { int mark; int arrival; };
static int compare_record(const void *left, const void *right)
{
    const struct Record *x = left;
    const struct Record *y = right;
    if (x->mark != y->mark) {
        return (x->mark > y->mark) - (x->mark < y->mark);
    }
    return (x->arrival > y->arrival) - (x->arrival < y->arrival);
}

int main(void)
{
    struct Record a[] = {{3, 2}, {1, 1}, {3, 0}};
    qsort(a, 3, sizeof a[0], compare_record);
    for (int i = 0; i < 3; i++) {
        printf("%d:%d%s", a[i].mark, a[i].arrival, i == 2 ? "\n" : " ");
    }
    return 0;
}
