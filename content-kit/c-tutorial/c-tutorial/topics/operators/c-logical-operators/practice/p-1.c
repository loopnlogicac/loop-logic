#include <stdio.h>

int main(void)
{
    int attendance, mark;
    printf("Input: ");
    if (scanf("%d %d", &attendance, &mark) != 2 || attendance < 0 || attendance > 100
        || mark < 0 || mark > 100) {
        return 1;
    }
    printf("%d\n", attendance >= 75 && mark >= 40);
    return 0;
}
