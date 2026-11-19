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
    puts("Day month year:");
    if (scanf("%d %d %d", &student.admitted.day, &student.admitted.month,
              &student.admitted.year) != 3 || student.admitted.day < 1
        || student.admitted.day > 28 || student.admitted.month < 1
        || student.admitted.month > 12 || student.admitted.year < 2000
        || student.admitted.year > 2100) {
        return 1;
    }
    printf("%04d-%02d-%02d\n", student.admitted.year,
           student.admitted.month, student.admitted.day);
    return 0;
}
