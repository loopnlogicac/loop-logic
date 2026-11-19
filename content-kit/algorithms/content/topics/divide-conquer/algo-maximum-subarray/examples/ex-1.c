#include <stdio.h>

static int kadane(const int a[], int n)
{
    int ending = a[0], best = a[0];
    for (int i = 1; i < n; i++) {
        ending = a[i] > ending + a[i] ? a[i] : ending + a[i];
        if (ending > best) { best = ending; }
    }
    return best;
}

int main(void)
{
    int a[] = {-2,3,-1,4,-5};
    printf("%d\n", kadane(a, 5));
    return 0;
}
