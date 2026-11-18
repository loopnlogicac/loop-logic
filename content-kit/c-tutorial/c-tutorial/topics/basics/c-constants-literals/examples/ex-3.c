#include <stdio.h>

enum { LAB_DAYS = 2 };

int main(void)
{
    char grade = 'A';
    printf("%c %s %d\n", grade, "lab", LAB_DAYS);
    return 0;
}
