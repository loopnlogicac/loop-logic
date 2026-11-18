#include <stdio.h>

/* A prototype makes the later function known here. */
int total_marks(int theory, int lab);

int main(void)
{
    printf("Total = %d\n", total_marks(60, 25));
    return 0;
}

int total_marks(int theory, int lab)
{
    return theory + lab;
}
