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
    struct LabRecord record = {17, 82};
    printf("%d %d\n", record.roll, lab_passed(&record));
    return 0;
}
