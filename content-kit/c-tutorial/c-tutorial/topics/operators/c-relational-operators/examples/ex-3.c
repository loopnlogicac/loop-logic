#include <stdio.h>
#include <math.h>

int main(void)
{
    double measured = 0.1 + 0.2;
    double target = 0.3;
    printf("%d\n", fabs(measured - target) <= 0.000001);
    return 0;
}
