#include <stdio.h>

struct Spread { char first; int number; char last; };
struct Grouped { int number; char first; char last; };

int main(void)
{
    struct Spread a = {.first = 'A', .number = 7, .last = 'Z'};
    struct Spread b = {.first = 'A', .number = 7, .last = 'Z'};
    int equal = a.first == b.first && a.number == b.number && a.last == b.last;
    printf("Equal fields: %d\n", equal);
    return 0;
}
