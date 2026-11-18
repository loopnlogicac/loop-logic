#include <stdio.h>

int main(void)
{
    int mark;
    printf("Input: ");
    if (scanf("%d", &mark) != 1 || mark < 0 || mark > 100) {
        return 1;
    }
    if (mark >= 40) {
        puts("Pass");
    } else {
        puts("Fail");
    }
    return 0;
}
