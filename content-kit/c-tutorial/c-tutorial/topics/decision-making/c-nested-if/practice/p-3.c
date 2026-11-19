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
            puts("Eligible");
        } else {
            puts("Low mark");
        }
    } else {
        puts("Unregistered");
    }
    return 0;
}
