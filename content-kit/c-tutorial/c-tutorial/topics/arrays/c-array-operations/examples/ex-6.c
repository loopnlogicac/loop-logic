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
    int values[] = {9, 9, 4, 7, 7};
    int second;
    if (second_largest(values, 5, &second)) {
        printf("%d\n", second);
    } else {
        puts("No second value");
    }
    return 0;
}
