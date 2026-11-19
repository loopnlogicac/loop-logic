#include <stdio.h>

#ifndef LOOP_LOGIC_LAB_RECORD_H
#define LOOP_LOGIC_LAB_RECORD_H
struct LabRecord { int roll; int score; };
static inline int lab_passed(const struct LabRecord *record)
{
    return record->score >= 40;
}
#endif


#ifndef LOOP_LOGIC_LAB_RECORD_H
#define LOOP_LOGIC_LAB_RECORD_H
struct LabRecord { int roll; int score; };
static inline int lab_passed(const struct LabRecord *record)
{
    return record->score >= 40;
}
#endif

int main(void)
{
    struct LabRecord a = {0}, b = {0};
    puts("Two scores:");
    if (scanf("%d %d", &a.score, &b.score) != 2 || a.score < 0 || a.score > 100
        || b.score < 0 || b.score > 100) {
        return 1;
    }
    printf("%d %d\n", lab_passed(&a), lab_passed(&b));
    return 0;
}
