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

int insert(int *values, int *size, int capacity, int position, int value)
{
    if (*size == capacity || position < 0 || position > *size) {
        return 0;
    }
    for (int i = *size; i > position; i--) {
        values[i] = values[i - 1];
    }
    values[position] = value;
    (*size)++;
    return 1;
}

int main(void)
{
    printf("Enter count and values: ");
    int n = read_count();
    int values[17];
    read_values(values, n);
    int position;
    int value;
    if (scanf("%d%d", &position, &value) != 2 || value < -99 || value > 99) {
        return 1;
    }
    printf("Inserted: %d\n", insert(values, &n, 16, position, value));
    print_values(values, n);
    return 0;
}
