#include <stdio.h>
#include <stdlib.h>

typedef struct { int key; int used; } Cell;
typedef struct { Cell *cells; size_t capacity; size_t count; } Table;
static size_t hash_key(int key, size_t capacity)
{
    long long r = (long long)key % (long long)capacity;
    return (size_t)(r < 0 ? r + (long long)capacity : r);
}
static size_t position(Cell *cells, size_t capacity, int key)
{
    size_t index = hash_key(key, capacity);
    while (cells[index].used && cells[index].key != key) {
        index = (index + 1) % capacity;
    }
    return index;
}
static int add(Table *table, int key)
{
    size_t index = position(table->cells, table->capacity, key);
    if (table->cells[index].used) { return 0; }
    if ((table->count + 1) * 10 > table->capacity * 6) {
        size_t capacity = table->capacity * 2 + 1;
        Cell *cells = malloc(capacity * sizeof *cells);
        if (cells == NULL) { return -1; }
        for (size_t i = 0; i < capacity; i++) { cells[i] = (Cell){0, 0}; }
        for (size_t i = 0; i < table->capacity; i++) {
            if (table->cells[i].used) {
                int old = table->cells[i].key;
                size_t next = position(cells, capacity, old);
                cells[next] = (Cell){old, 1};
            }
        }
        printf("grow %zu -> %zu\n", table->capacity, capacity);
        free(table->cells);
        table->cells = cells;
        table->capacity = capacity;
        index = position(cells, capacity, key);
    }
    table->cells[index] = (Cell){key, 1};
    table->count++;
    return 1;
}

int main(void)
{
    Table table = {NULL, 5, 0};
    int n;
    puts("Count and keys to rehash:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) { return 1; }
    table.cells = malloc(table.capacity * sizeof *table.cells);
    if (table.cells == NULL) { return 1; }
    for (size_t i = 0; i < table.capacity; i++) { table.cells[i] = (Cell){0, 0}; }
    for (int i = 0; i < n; i++) {
        int key;
        if (scanf("%d", &key) != 1 || add(&table, key) < 0) {
            free(table.cells); return 1;
        }
    }
    printf("keys=%zu capacity=%zu\n", table.count, table.capacity);
    for (size_t i = 0; i < table.capacity; i++) {
        if (table.cells[i].used) { printf("%zu:%d\n", i, table.cells[i].key); }
    }
    free(table.cells);
    return 0;
}
