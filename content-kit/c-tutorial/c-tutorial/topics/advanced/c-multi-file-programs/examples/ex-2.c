#include <stdio.h>
#include "marks.h"
#include "marks.h"

int main(void)
{
    int marks[] = {40, 40, 39};
    printf("Pass boundary: %d\n", passed_count(marks, 3));
    return 0;
}
