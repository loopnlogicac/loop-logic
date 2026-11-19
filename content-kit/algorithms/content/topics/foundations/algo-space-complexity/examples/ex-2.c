#include <stdio.h>

static void show(const int a[], int n)
{
    for (int i = 0; i < n; i++) {
        printf("%s%d", i ? " " : "", a[i]);
    }
    puts("");
}

int main(void)
{
    int a[] = {7, 3, 5, 3, 1};
    int copy[5];
    for (int i = 0; i < 5; i++) {
        copy[i] = a[4 - i];
    }
    show(a, 5);
    show(copy, 5);
    return 0;
}
