#include <stdio.h>
#include <stddef.h>

struct Spread { char first; int number; char last; };
struct Grouped { int number; char first; char last; };

int main(void)
{
    printf("First at zero: %d\n", offsetof(struct Spread, first) == 0);
    printf("No overlap: %d\n", offsetof(struct Spread, last)
           >= offsetof(struct Spread, number) + sizeof(int));
    printf("Enough space: %d\n", sizeof(struct Spread)
           >= offsetof(struct Spread, last) + sizeof(char));
    return 0;
}
