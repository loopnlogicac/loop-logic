#include <stdio.h>

int main(void)
{
    float temperature;
    double cgpa;
    printf("Input: ");
    if (scanf("%f %lf", &temperature, &cgpa) != 2) {
        return 1;
    }
    printf("Temperature=%.1f CGPA=%.2f\n", temperature, cgpa);
    return 0;
}
