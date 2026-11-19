#include <stdio.h>

static int total(const int a[], int n)
{
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += a[i];
    }
    return sum;
}

int main(void)
{
    int a[] = {40, 25, 35};
    printf("total = %d\n", total(a, 3));
    return 0;
}
