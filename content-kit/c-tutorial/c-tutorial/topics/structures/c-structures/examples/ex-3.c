#include <stdio.h>

struct Student {
    int roll;
    char name[20];
    int mark;
};

int main(void)
{
    struct Student student = {.roll = 23};
    printf("%d %d %d\n", student.roll, student.mark, student.name[0] == '\0');
    student.mark = 75;
    printf("Updated: %d\n", student.mark);
    return 0;
}
