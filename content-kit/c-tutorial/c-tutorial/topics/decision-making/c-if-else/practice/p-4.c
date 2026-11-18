#include <stdio.h>

int main(void)
{
    int registered, mark;
    printf("Input: ");
    if (scanf("%d %d", &registered, &mark) != 2 || registered < 0 || registered > 1 || mark < 0
        || mark > 100) {
        return 1;
    }
    if (registered) {
        if (mark >= 40) {
            puts("Certificate");
        } else {
            puts("Practice first");
        }
    } else {
        puts("Register first");
    }
    return 0;
}
