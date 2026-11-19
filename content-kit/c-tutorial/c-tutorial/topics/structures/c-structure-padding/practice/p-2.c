#include <stdio.h>

struct Spread { char first; int number; char last; };
struct Grouped { int number; char first; char last; };

int main(void)
{
    size_t count;
    puts("Record count:");
    if (scanf("%zu", &count) != 1 || count > 20) {
        return 1;
    }
    printf("%zu\n", count * sizeof(struct Spread));
    return 0;
}
