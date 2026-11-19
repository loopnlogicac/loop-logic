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
    struct Record first = {0};
    int new_lab;
    puts("Theory, lab, new lab:");
    if (scanf("%d %d %d", &first.result.theory, &first.result.lab, &new_lab) != 3
        || first.result.theory < 0 || first.result.theory > 75
        || first.result.lab < 0 || first.result.lab > 25 || new_lab < 0 || new_lab > 25) {
        return 1;
    }
    struct Record second = first;
    second.result.lab = new_lab;
    printf("%d %d\n", first.result.lab, second.result.lab);
    return 0;
}
