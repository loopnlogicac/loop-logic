#include <stdio.h>
#include <math.h>



int main(void)
{
    double pi = acos(-1.0);
    double angle = 30.0 * pi / 180.0;
    printf("%.6f %.6f\n", sin(angle), cos(angle));
    return 0;
}
