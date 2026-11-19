#include <stdio.h>

int main(void)
{
    int marks[] = {12, 24, 36};
    printf("%d %d\n", marks[1], *(marks + 1));
    return 0;
}
