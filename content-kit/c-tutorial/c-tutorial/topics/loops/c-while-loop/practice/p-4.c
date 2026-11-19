#include <stdio.h>

int main(void)
{
    int mark;
    int count = 0;
    int sum = 0;
    printf("Input: ");
    while (scanf("%d", &mark) == 1 && mark != -1) {
        if (mark < 0 || mark > 100 || count == 100) {
            return 1;
        }
        sum += mark;
        count++;
    }
    printf("%d %d\n", count, sum);
    return 0;
}
