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

void print_values(const int *values, int n)
{
    printf("Values:");
    for (int i = 0; i < n; i++) {
        printf(" %d", values[i]);
    }
    putchar('\n');
}

int main(void)
{
    printf("Enter count and values: ");
    int n = read_count();
    int values[17];
    read_values(values, n);
    int *copy = n == 0 ? NULL : malloc((size_t)n * sizeof *copy);
    if (n != 0 && copy == NULL) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        copy[i] = values[i];
    }
    if (n > 0) {
        copy[0]++;
    }
    print_values(values, n);
    print_values(copy, n);
    free(copy);
    return 0;
}
