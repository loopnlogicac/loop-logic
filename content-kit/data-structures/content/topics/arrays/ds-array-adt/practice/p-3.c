#include <stdio.h>
#include <stdlib.h>

int read_count(void)
{
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        exit(EXIT_FAILURE);
    }
    return n;
}

void read_values(int *values, int n)
{
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -99 || values[i] > 99) {
            exit(EXIT_FAILURE);
        }
    }
}

int find(const int *values, int n, int target, int *comparisons)
{
    *comparisons = 0;
    for (int i = 0; i < n; i++) {
        (*comparisons)++;
        if (values[i] == target) {
            return i;
        }
    }
    return -1;
}

int main(void)
{
    printf("Enter count and values: ");
    int n = read_count();
    int values[17];
    read_values(values, n);
    int target;
    int comparisons;
    if (scanf("%d", &target) != 1) {
        return 1;
    }
    printf("Index: %d\n", find(values, n, target, &comparisons));
    return 0;
}
