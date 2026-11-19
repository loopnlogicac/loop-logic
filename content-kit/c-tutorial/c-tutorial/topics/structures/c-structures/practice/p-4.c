#include <stdio.h>

struct Student {
    int roll;
    char name[20];
    int mark;
};

int main(void)
{
    struct Student a = {0}, b = {0};
    puts("Two rolls and marks:");
    if (scanf("%d %d %d %d", &a.roll, &a.mark, &b.roll, &b.mark) != 4
        || a.roll < 1 || a.roll > 999 || b.roll < 1 || b.roll > 999
        || a.mark < 0 || a.mark > 100 || b.mark < 0 || b.mark > 100) {
        return 1;
    }
    struct Student best = a;
    if (b.mark > a.mark || (b.mark == a.mark && b.roll < a.roll)) {
        best = b;
    }
    printf("%d %d\n", best.roll, best.mark);
    return 0;
}
