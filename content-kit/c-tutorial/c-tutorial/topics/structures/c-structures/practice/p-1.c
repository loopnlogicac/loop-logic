#include <stdio.h>

struct Student {
    int roll;
    char name[20];
    int mark;
};

int main(void)
{
    struct Student student = {0};
    puts("Roll and mark:");
    if (scanf("%d %d", &student.roll, &student.mark) != 2 || student.roll < 1
        || student.roll > 999 || student.mark < 0 || student.mark > 100) {
        return 1;
    }
    printf("%d %s\n", student.roll, student.mark >= 40 ? "pass" : "fail");
    return 0;
}
