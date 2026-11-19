#include <stdio.h>

struct Date { int day; int month; int year; };
struct Result { int theory; int lab; };
struct Record {
    int roll;
    struct Date admitted;
    struct Result result;
};

int main(void)
{
    struct Record student = {0};
    puts("Theory and lab:");
    if (scanf("%d %d", &student.result.theory, &student.result.lab) != 2
        || student.result.theory < 0 || student.result.theory > 75
        || student.result.lab < 0 || student.result.lab > 25) {
        return 1;
    }
    printf("%d\n", student.result.theory + student.result.lab);
    return 0;
}
