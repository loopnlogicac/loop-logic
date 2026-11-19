#include <stdio.h>
#include <math.h>



int main(void)
{
    double value;
    puts("Rounding input:");
    if (scanf("%lf", &value) != 1 || !isfinite(value) || value < -100 || value > 100) {
        return 1;
    }
    printf("%.0f %.0f %.0f\n", ceil(value), floor(value), round(value));
    return 0;
}
