#include <stdio.h>
#include <stdlib.h>

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
    int values[] = {12, 24, 36, 48};
    int comparisons;
    int index = find(values, 4, 12, &comparisons);
    printf("First: index=%d comparisons=%d\n", index, comparisons);
    index = find(values, 4, 48, &comparisons);
    printf("Last: index=%d comparisons=%d\n", index, comparisons);
    index = find(values, 4, 99, &comparisons);
    printf("Absent: index=%d comparisons=%d\n", index, comparisons);
    return 0;
}
