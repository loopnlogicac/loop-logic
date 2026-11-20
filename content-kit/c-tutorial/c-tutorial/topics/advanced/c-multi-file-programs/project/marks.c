#include "marks.h"

static int is_pass(int mark)
{
    return mark >= 40;
}

int passed_count(const int marks[], int count)
{
    int passed = 0;
    for (int i = 0; i < count; ++i) {
        passed += is_pass(marks[i]);
    }
    return passed;
}
