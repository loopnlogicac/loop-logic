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
    int values[] = {3, 8, 5};
    int *found = find(values, 3, 8);
    if (found != NULL) {
        *found = 10;
    }
    printf("%d\n", values[1]);
    return 0;
}
