#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count;
    puts("Count and values:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 30) {
        return 1;
    }
    int *values = NULL;
    size_t used = 0, capacity = 0;
    for (int i = 0; i < count; i++) {
        if (used == capacity) {
            size_t larger = capacity == 0 ? 1 : capacity * 2;
            int *next = realloc(values, larger * sizeof *values);
            if (next == NULL) {
                free(values);
                return 1;
            }
            values = next;
            capacity = larger;
        }
        int value;
        if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
            free(values);
            return 1;
        }
        values[used++] = value;
    }
    int total = 0;
    for (size_t i = 0; i < used; i++) {
        total += values[i];
    }
    printf("%d %zu\n", total, capacity);
    free(values);
    return 0;
}
