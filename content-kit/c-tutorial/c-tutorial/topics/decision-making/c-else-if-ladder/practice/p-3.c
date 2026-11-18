#include <stdio.h>

int main(void)
{
    int mark;
    printf("Input: ");
    if (scanf("%d", &mark) != 1 || mark < 0 || mark > 100) {
        return 1;
    }
    if (mark >= 80) {
        puts("A+");
    } else if (mark >= 75) {
        puts("A");
    } else if (mark >= 40) {
        puts("Pass");
    } else {
        puts("F");
    }
    return 0;
}
