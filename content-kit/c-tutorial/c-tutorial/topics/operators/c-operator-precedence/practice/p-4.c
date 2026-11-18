#include <stdio.h>

int main(void)
{
    int attendance, mark, special;
    printf("Input: ");
    if (scanf("%d %d %d", &attendance, &mark, &special) != 3 || attendance < 0
        || attendance > 100 || mark < 0 || mark > 100
        || special < 0 || special > 1) {
        return 1;
    }
    printf("%d\n", attendance >= 75 && (mark >= 40 || special));
    return 0;
}
