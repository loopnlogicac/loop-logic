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

int pop(Vector *vector)
{
    if (vector->size == 0) {
        return 0;
    }
    vector->size--;
    if (vector->capacity > 1 && vector->size <= vector->capacity / 4) {
        size_t capacity = vector->capacity / 2;
        int *values = realloc(vector->values, capacity * sizeof *values);
        if (values != NULL) {
            vector->values = values;
            vector->capacity = capacity;
        }
    }
    return 1;
}

void show(const Vector *vector)
{
    printf("size=%zu capacity=%zu values:", vector->size, vector->capacity);
    for (size_t i = 0; i < vector->size; i++) {
        printf(" %d", vector->values[i]);
    }
    putchar('\n');
}

int main(void)
{
    Vector vector = {NULL, 0, 0};
    for (int value = 1; value <= 8; value++) {
        if (!append(&vector, value)) {
            free(vector.values);
            return 1;
        }
    }
    while (vector.size > 0) {
        pop(&vector);
        show(&vector);
    }
    free(vector.values);
    return 0;
}
