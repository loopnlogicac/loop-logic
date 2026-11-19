#include <stdio.h>

static void reverse(int a[], int n)
{
    int left = 0;
    int right = n - 1;
    while (left < right) {
        int saved = a[left];
        a[left++] = a[right];
        a[right--] = saved;
    }
}
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
    reverse(a, 5);
    show(a, 5);
    return 0;
}
