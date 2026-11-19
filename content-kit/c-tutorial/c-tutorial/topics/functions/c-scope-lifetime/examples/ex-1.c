#include <stdio.h>



int main(void)
{
    int mark = 70;
    printf("outer: %d\n", mark);
    {
        int mark = 92;
        printf("inner: %d\n", mark);
    }
    printf("outer again: %d\n", mark);
    return 0;
}
