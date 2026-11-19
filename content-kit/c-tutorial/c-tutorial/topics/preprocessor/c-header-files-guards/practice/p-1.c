#include <stdio.h>

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
    struct LabRecord record = {1, 0};
    puts("Score:");
    if (scanf("%d", &record.score) != 1 || record.score < 0 || record.score > 100) {
        return 1;
    }
    printf("%d\n", lab_passed(&record));
    return 0;
}
