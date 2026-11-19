#include <stdio.h>

struct Student {
    int roll;
    char name[20];
    int mark;
};

int main(void)
{
    struct Student student = {.roll = 17, .name = "Learner", .mark = 82};
    printf("%d %s %d\n", student.roll, student.name, student.mark);
    return 0;
}
