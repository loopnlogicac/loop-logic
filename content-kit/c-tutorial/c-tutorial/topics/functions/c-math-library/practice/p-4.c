#include <stdio.h>
#include <math.h>



int main(void)
{
    double degrees;
    puts("Degrees:");
    if (scanf("%lf", &degrees) != 1 || !isfinite(degrees) || fabs(degrees) > 360) {
        return 1;
    }
    double radians = degrees * acos(-1.0) / 180.0;
    double sine = sin(radians), cosine = cos(radians);
    puts(fabs(sine * sine + cosine * cosine - 1.0) <= 1e-12 ? "OK" : "Check");
    return 0;
}
