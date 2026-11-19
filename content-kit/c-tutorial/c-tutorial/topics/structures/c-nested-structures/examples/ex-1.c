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
    struct Record student = {17, {5, 2, 2026}, {70, 20}};
    printf("%d %d-%d-%d\n", student.roll, student.admitted.day,
           student.admitted.month, student.admitted.year);
    return 0;
}
