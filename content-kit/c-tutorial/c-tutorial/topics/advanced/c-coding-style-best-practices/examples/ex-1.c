#include <stdio.h>

enum { PASS_MARK = 40 };

static int has_passed(int mark)
{
    return mark >= PASS_MARK;
}

int main(void)
{
    int marks[] = {39, 40, 72};
    for (int i = 0; i < 3; ++i) {
        printf("%d: %s\n", marks[i], has_passed(marks[i]) ? "pass" : "fail");
    }
    return 0;
}
