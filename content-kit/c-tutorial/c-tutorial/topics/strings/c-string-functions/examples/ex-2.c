#include <stdio.h>
#include <string.h>

int main(void)
{
    int order = strcmp("Lab1", "Lab2");
    printf("before: %d\n", order < 0);
    printf("equal: %d\n", strcmp("DIU", "DIU") == 0);
    return 0;
}
