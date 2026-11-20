#include <stdio.h>
#include <stdbool.h>

int main(void)
{
    int mark;
    if (scanf("%d", &mark) != 1 || mark < 0 || mark > 100) {
        puts("invalid");
        return 0;
    }
    bool passed = mark >= 40;
    puts(passed ? "pass" : "fail");
    return 0;
}
