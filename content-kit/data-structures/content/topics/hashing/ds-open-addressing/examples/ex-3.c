#include <stdio.h>
#include <stdlib.h>

static int bucket(int key, int size)
{
    int r = key % size;
    return r < 0 ? r + size : r;
}
typedef struct { int key; int state; } Slot;
static int probe(int key, int method, int attempt)
{
    int offset = attempt;
    if (method == 1) { offset = attempt * attempt; }
    if (method == 2) { offset = attempt * (1 + bucket(key, 10)); }
    return (bucket(key, 11) + offset) % 11;
}

int main(void)
{
    int key, method;
    puts("Key and method (0..2):");
    if (scanf("%d%d", &key, &method) != 2 || method < 0 || method > 2) { return 1; }
    for (int attempt = 0; attempt < 11; attempt++) {
        printf("%s%d", attempt == 0 ? "" : " ", probe(key, method, attempt));
    }
    putchar('\n');
    return 0;
}
