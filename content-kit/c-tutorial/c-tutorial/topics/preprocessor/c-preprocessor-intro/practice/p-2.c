#include <stdio.h>

#define PASS_MARK 40

int main(void)
{
    int mark;
    puts("Mark:");
    if (scanf("%d", &mark) != 1 || mark < 0 || mark > 100) {
        return 1;
    }
    puts(mark >= PASS_MARK ? "pass" : "fail");
    return 0;
}
