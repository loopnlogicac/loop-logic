#include <stdio.h>

struct Student {
    int roll;
    char name[20];
    int mark;
};

int main(void)
{
    struct Student first = {11, "Alpha", 65};
    struct Student second = first;
    second.roll = 12;
    second.name[0] = 'O';
    second.mark = 90;
    printf("%s %d | %s %d\n", first.name, first.mark, second.name, second.mark);
    return 0;
}
