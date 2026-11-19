#include <stdio.h>

struct Spread { char first; int number; char last; };
struct Grouped { int number; char first; char last; };

int main(void)
{
    int count;
    puts("Count and numbers:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 10) {
        return 1;
    }
    struct Spread records[10];
    for (int i = 0; i < count; i++) {
        if (scanf("%d", &records[i].number) != 1 || records[i].number < -100
            || records[i].number > 100) {
            return 1;
        }
        records[i].first = 'A';
        records[i].last = 'Z';
    }
    for (int i = 0; i < count; i++) {
        printf("%c %d %c\n", records[i].first, records[i].number, records[i].last);
    }
    return 0;
}
