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
    int count;
    puts("Count and scores:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 10) {
        return 1;
    }
    int passed = 0;
    for (int i = 0; i < count; i++) {
        struct LabRecord record = {i + 1, 0};
        if (scanf("%d", &record.score) != 1 || record.score < 0 || record.score > 100) {
            return 1;
        }
        passed += lab_passed(&record);
    }
    printf("%d\n", passed);
    return 0;
}
