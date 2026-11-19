#include <stdio.h>

struct Spread { char first; int number; char last; };
struct Grouped { int number; char first; char last; };

int main(void)
{
    printf("int alignment: %zu\n", _Alignof(int));
    printf("Record alignment: %zu\n", _Alignof(struct Spread));
    printf("Array stride: %zu\n", sizeof(struct Spread));
    return 0;
}
