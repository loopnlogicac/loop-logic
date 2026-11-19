#include <stdio.h>

int *find(int *a, size_t n, int key)
{
    for (size_t i = 0; i < n; i++) {
        if (a[i] == key) {
            return a + i;
        }
    }
    return NULL;
}

int main(void)
{
    int a[] = {3, 8, 5};
    int value;
    puts("Replacement for 8:");
    if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
        return 1;
    }
    int *p = find(a, 3, 8);
    if (p != NULL) {
        *p = value;
    }
    printf("%d %d %d\n", a[0], a[1], a[2]);
    return 0;
}
