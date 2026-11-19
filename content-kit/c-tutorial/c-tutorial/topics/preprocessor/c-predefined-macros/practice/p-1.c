#include <stdio.h>

#define REPORT(value) printf("%s:%d value=%d\n", __FILE__, __LINE__, (value))

int main(void)
{
    int value;
    puts("Mark value:");
    if (scanf("%d", &value) != 1 || value < 0 || value > 100) {
        return 1;
    }
    #line 300 "practice-marks.c"
    REPORT(value);
    return 0;
}
