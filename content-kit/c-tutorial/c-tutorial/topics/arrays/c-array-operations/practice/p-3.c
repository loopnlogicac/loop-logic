#include <stdio.h>

int second_largest(const int values[], int n, int *second)
{
    int largest = values[0];
    int found = 0;
    for (int i = 1; i < n; i++) {
        if (values[i] > largest) {
            *second = largest;
            largest = values[i];
            found = 1;
        } else if (values[i] < largest && (!found || values[i] > *second)) {
            *second = values[i];
            found = 1;
        }
    }
    return found;
}

int main(void)
{
    int n;
    int values[20];
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 20) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }

    int second;
    if (second_largest(values, n, &second)) {
        printf("%d\n", second);
    } else {
        puts("No second value");
    }
    return 0;
}
