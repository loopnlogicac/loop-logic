#include <stdio.h>

int main(void)
{
    float temperature;
    double voltage;
    printf("Input: ");
    if (scanf("%f %lf", &temperature, &voltage) != 2) {
        return 1;
    }
    printf("T=%.2f V=%.2f\n", temperature, voltage);
    return 0;
}
