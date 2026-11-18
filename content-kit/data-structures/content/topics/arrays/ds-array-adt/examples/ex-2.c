#include <stdio.h>
#include <stdlib.h>

void print_values(const int *values, int n)
{
    printf("Values:");
    for (int i = 0; i < n; i++) {
        printf(" %d", values[i]);
    }
    putchar('\n');
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
    int values[] = {72, 85, 64, 91};
    int comparisons;
    print_values(values, 4);
    int position = find(values, 4, 64, &comparisons);
    printf("Found: %d after %d comparisons\n", position, comparisons);
    return 0;
}
