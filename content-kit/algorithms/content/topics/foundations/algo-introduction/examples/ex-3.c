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
    printf("total = %d\n", total(NULL, 0));
    return 0;
}
