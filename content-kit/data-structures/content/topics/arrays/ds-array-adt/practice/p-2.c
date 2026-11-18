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

int erase(int *values, int *size, int position)
{
    if (position < 0 || position >= *size) {
        return 0;
    }
    for (int i = position; i + 1 < *size; i++) {
        values[i] = values[i + 1];
    }
    (*size)--;
    return 1;
}

int main(void)
{
    printf("Enter count and values: ");
    int n = read_count();
    int values[17];
    read_values(values, n);
    int position;
    if (scanf("%d", &position) != 1) {
        return 1;
    }
    printf("Removed: %d\n", erase(values, &n, position));
    print_values(values, n);
    return 0;
}
