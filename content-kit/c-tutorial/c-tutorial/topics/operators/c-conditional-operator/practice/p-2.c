#include <stdio.h>

int main(void)
{
    int mark;
    printf("Input: ");
    if (scanf("%d", &mark) != 1 || mark < 0 || mark > 100) {
        return 1;
    }
    printf("%s\n", mark >= 40 ? "Pass" : "Fail");
    return 0;
}
