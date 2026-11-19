#include <stdio.h>

#define REPORT(value) printf("%s:%d value=%d\n", __FILE__, __LINE__, (value))

int main(void)
{
    #line 200 "marks.c"
    REPORT(17);
    return 0;
}
