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
    struct Record a = {0}, b = {0};
    puts("Two dates, each day month year:");
    if (scanf("%d %d %d %d %d %d", &a.admitted.day, &a.admitted.month,
              &a.admitted.year, &b.admitted.day, &b.admitted.month, &b.admitted.year) != 6) {
        return 1;
    }
    struct Date x = a.admitted, y = b.admitted;
    if (x.day < 1 || x.day > 28 || y.day < 1 || y.day > 28
        || x.month < 1 || x.month > 12 || y.month < 1 || y.month > 12
        || x.year < 2000 || x.year > 2100 || y.year < 2000 || y.year > 2100) {
        return 1;
    }
    int same = x.year == y.year && x.month == y.month && x.day == y.day;
    int earlier = x.year < y.year || (x.year == y.year && x.month < y.month)
        || (x.year == y.year && x.month == y.month && x.day < y.day);
    puts(same ? "same" : (earlier ? "first" : "second"));
    return 0;
}
