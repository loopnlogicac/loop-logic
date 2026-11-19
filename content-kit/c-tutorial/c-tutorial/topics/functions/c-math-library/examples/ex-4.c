#include <stdio.h>
#include <math.h>



int main(void)
{
    double root = sqrt(2.0);
    double error = fabs(root * root - 2.0);
    puts(error <= 1e-12 ? "Within tolerance" : "Too far");
    return 0;
}
