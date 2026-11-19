#include <stdio.h>

#ifdef USE_LAB_HEADER
#include "lab-record.h"
#include "lab-record.h"
#else

#ifndef LOOP_LOGIC_LAB_RECORD_H
#define LOOP_LOGIC_LAB_RECORD_H
struct LabRecord { int roll; int score; };
static inline int lab_passed(const struct LabRecord *record)
{
    return record->score >= 40;
}
#endif

#endif

int main(void)
{
    struct LabRecord record = {5, 40};
    printf("Pass: %d\n", lab_passed(&record));
    return 0;
}
