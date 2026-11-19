#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *values;
    size_t size;
    size_t capacity;
} Vector;

int append(Vector *vector, int value)
{
    if (vector->size == vector->capacity) {
        size_t capacity = vector->capacity == 0 ? 1 : 2 * vector->capacity;
        if (capacity > 1024) {
            return 0;
        }
        int *values = realloc(vector->values, capacity * sizeof *values);
        if (values == NULL) {
            return 0;
        }
        vector->values = values;
        vector->capacity = capacity;
    }
    vector->values[vector->size++] = value;
    return 1;
}

int main(void)
{
    int n;
    Vector vector = {NULL, 0, 0};
    printf("Enter count and values: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < -99 || value > 99
            || !append(&vector, value)) {
            free(vector.values);
            return 1;
        }
    }
    printf("Spare: %zu\n", vector.capacity - vector.size);
    free(vector.values);
    return 0;
}
