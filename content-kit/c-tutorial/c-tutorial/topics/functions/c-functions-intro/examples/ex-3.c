#include <stdio.h>

void line(void)
{
    puts("----------------");
}

void report(void)
{
    puts("report starts");
    line();
    puts("report ends");
}

int main(void)
{
    puts("main starts");
    report();
    puts("main resumes");
    return 0;
}
