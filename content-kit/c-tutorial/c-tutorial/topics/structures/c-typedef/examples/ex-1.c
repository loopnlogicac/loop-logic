#include <stdio.h>

typedef unsigned long Roll;
typedef struct Mark { Roll roll; int score; } Mark;

int main(void)
{
    Mark student = {17UL, 82};
    printf("%lu %d\n", student.roll, student.score);
    return 0;
}
