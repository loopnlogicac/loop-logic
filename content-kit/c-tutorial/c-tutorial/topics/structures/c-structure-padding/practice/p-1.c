#include <stdio.h>

struct Spread { char first; int number; char last; };
struct Grouped { int number; char first; char last; };

int main(void)
{
    struct Spread a, b;
    puts("Two numbers:");
    if (scanf("%d %d", &a.number, &b.number) != 2 || a.number < -100 || a.number > 100
        || b.number < -100 || b.number > 100) {
        return 1;
    }
    a.first = b.first = 'A';
    a.last = b.last = 'Z';
    printf("%d\n", a.first == b.first && a.number == b.number && a.last == b.last);
    return 0;
}
