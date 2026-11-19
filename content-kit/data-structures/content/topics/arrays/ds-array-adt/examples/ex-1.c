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
    int mode;
    int position;
    int value;
    printf("Enter count, values, mode (0=insert, 1=delete), position and value: ");
    int size = read_count();
    int values[16];
    if (size > 8) {
        return 1;
    }
    read_values(values, size);
    if (scanf("%d%d%d", &mode, &position, &value) != 3 || mode < 0 || mode > 1
        || value < -99 || value > 99) {
        return 1;
    }
    int changed = mode == 0 ? insert(values, &size, 8, position, value)
                            : erase(values, &size, position);
    printf("Changed: %d\n", changed);
    print_values(values, size);
    return 0;
}
