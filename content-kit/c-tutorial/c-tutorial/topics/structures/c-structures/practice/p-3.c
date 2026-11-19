#include <stdio.h>

struct Student {
    int roll;
    char name[20];
    int mark;
};

int main(void)
{
    struct Student student = {0};
    puts("Roll:");
    if (scanf("%d", &student.roll) != 1 || student.roll < 1 || student.roll > 999) {
        return 1;
    }
    printf("%d %d\n", student.roll, student.mark);
    return 0;
}
