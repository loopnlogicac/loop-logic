#include <stdio.h>
#include <math.h>



int main(void)
{
    double x1, y1, x2, y2;
    puts("Coordinates:");
    if (scanf("%lf%lf%lf%lf", &x1, &y1, &x2, &y2) != 4 ||
        !isfinite(x1) || !isfinite(y1) || !isfinite(x2) || !isfinite(y2) ||
        fabs(x1) > 1000 || fabs(y1) > 1000 || fabs(x2) > 1000 || fabs(y2) > 1000) {
        return 1;
    }
    double dx = x2 - x1, dy = y2 - y1;
    printf("%.3f\n", sqrt(dx * dx + dy * dy));
    return 0;
}
