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
    struct Record first = {.roll = 4, .admitted = {.year = 2026},
                           .result = {.theory = 60, .lab = 18}};
    struct Record second = first;
    second.result.lab = 25;
    printf("%d %d %d\n", first.result.lab, second.result.lab, first.admitted.day);
    return 0;
}
