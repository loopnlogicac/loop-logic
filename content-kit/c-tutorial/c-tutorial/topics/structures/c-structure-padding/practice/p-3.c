#include <stdio.h>

struct Spread { char first; int number; char last; };
struct Grouped { int number; char first; char last; };

int main(void)
{
    struct Spread input = {0};
    puts("Number:");
    if (scanf("%d", &input.number) != 1 || input.number < -100 || input.number > 100) {
        return 1;
    }
    input.first = 'A';
    input.last = 'Z';
    struct Grouped output = {.number = input.number, .first = input.first, .last = input.last};
    printf("%c %d %c\n", output.first, output.number, output.last);
    return 0;
}
