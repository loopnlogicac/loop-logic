#include <stdio.h>
#include <stddef.h>

struct Spread { char first; int number; char last; };
struct Grouped { int number; char first; char last; };

int main(void)
{
    printf("Spread: %zu Grouped: %zu\n", sizeof(struct Spread), sizeof(struct Grouped));
    printf("Offsets: %zu %zu %zu\n", offsetof(struct Spread, first),
           offsetof(struct Spread, number), offsetof(struct Spread, last));
    return 0;
}
