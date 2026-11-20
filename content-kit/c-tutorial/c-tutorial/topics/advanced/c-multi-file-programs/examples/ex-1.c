#include <stdio.h>
#include "marks.h"

int main(void)
{
    int marks[] = {39, 40, 82, 18};
    printf("Passed: %d\n", passed_count(marks, 4));
    return 0;
}
