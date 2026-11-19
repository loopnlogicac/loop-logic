#include <stdio.h>

int main(void)
{
    int theory = 60;
    int lab = 25;
    printf("%d %d %d\n", theory < lab, theory != lab, theory > lab);
    return 0;
}
