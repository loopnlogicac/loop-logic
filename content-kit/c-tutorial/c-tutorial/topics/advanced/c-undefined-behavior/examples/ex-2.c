#include <stddef.h>
#include <stdio.h>

int main(void)
{
    int marks[] = {40, 60, 80};
    int *end = marks + 3;
    ptrdiff_t count = end - marks;
    int total = 0;
    for (int *p = marks; p != end; ++p) {
        total += *p;
    }
    printf("Count: %td\n", count);
    printf("Total: %d\n", total);
    return 0;
}
