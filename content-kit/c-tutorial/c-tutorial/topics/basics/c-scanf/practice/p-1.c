#include <stdio.h>

int main(void)
{
    int mark;
    printf("Input: ");
    if (scanf("%d", &mark) != 1) {
        puts("Invalid");
        return 0;
    }
    printf("Mark=%d\n", mark);
    return 0;
}
