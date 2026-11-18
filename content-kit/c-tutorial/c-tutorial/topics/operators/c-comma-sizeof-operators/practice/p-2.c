#include <stdio.h>

int main(void)
{
    int marks[3];
    printf("Input: ");
    if (scanf("%d %d %d", &marks[0], &marks[1], &marks[2]) != 3) {
        return 1;
    }
    printf("%zu\n", sizeof marks / sizeof marks[0]);
    return 0;
}
