#include <stdio.h>

int main(void)
{
    int marks[] = {60, 70, 80, 90};
    size_t count = sizeof marks / sizeof marks[0];
    printf("%zu\n", count);
    return 0;
}
