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
    struct Record student = {.roll = 8, .admitted = {1, 3, 2026}, .result = {65, 22}};
    struct Result old = student.result;
    student.result = (struct Result){70, 25};
    printf("%d %d\n", old.theory + old.lab, student.result.theory + student.result.lab);
    return 0;
}
