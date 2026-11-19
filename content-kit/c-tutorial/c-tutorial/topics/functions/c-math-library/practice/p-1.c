#include <stdio.h>
#include <math.h>



int main(void)
{
    double value;
    puts("Nonnegative value:");
    if (scanf("%lf", &value) != 1 || !isfinite(value) || value < 0 || value > 1000000) {
        return 1;
    }
    printf("%.4f\n", sqrt(value));
    return 0;
}
