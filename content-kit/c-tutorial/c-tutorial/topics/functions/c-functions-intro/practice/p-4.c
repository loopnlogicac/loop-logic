#include <stdio.h>

int passed(int mark)
{
    return mark >= 40;
}

void report(int mark)
{
    puts(passed(mark) ? "Pass" : "Retry");
}

int main(void)
{
    int mark;
    puts("Marks:");
    if (scanf("%d", &mark) != 1 || mark < 0 || mark > 100) {
        return 1;
    }
    report(mark);
    return 0;
}
