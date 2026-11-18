#include <stdio.h>

int main(void)
{
    int theory = 60;
    int lab = 25;
    int wrong_total = theory - lab;
    printf("theory=%d lab=%d wrong=%d\n", theory, lab, wrong_total);
    return 0;
}
