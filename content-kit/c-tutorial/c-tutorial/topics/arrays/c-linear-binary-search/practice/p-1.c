#include <stdio.h>

int linear(const int values[], int count, int key)
{
    for (int i = 0; i < count; i++) {
        if (values[i] == key) {
            return i;
        }
    }
    return -1;
}

int main(void)
{
    int n;
    int values[20];
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }
    int key;
    puts("Search key:");
    if (scanf("%d", &key) != 1 || key < -100 || key > 100) {
        return 1;
    }
    printf("%d\n", linear(values, n, key));
    return 0;
}
