#include <stdio.h>

int main(void)
{
    double voltage = 3.5;
    printf("%.2f %.2lf %.1e %g %c %s\n", voltage, voltage, voltage, voltage, 'A', "lab");
    return 0;
}
