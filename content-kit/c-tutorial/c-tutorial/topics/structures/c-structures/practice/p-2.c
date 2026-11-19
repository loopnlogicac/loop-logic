#include <stdio.h>

struct Student {
    int roll;
    char name[20];
    int mark;
};

int main(void)
{
    struct Student first = {1, "Alpha", 0};
    int bonus;
    puts("Mark and bonus:");
    if (scanf("%d %d", &first.mark, &bonus) != 2 || first.mark < 0 || first.mark > 100
        || bonus < 0 || bonus > 20) {
        return 1;
    }
    struct Student second = first;
    second.mark += bonus;
    if (second.mark > 100) {
        second.mark = 100;
    }
    printf("%d %d\n", first.mark, second.mark);
    return 0;
}
