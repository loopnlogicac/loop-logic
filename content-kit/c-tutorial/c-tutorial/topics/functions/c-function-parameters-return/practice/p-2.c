#include <stdio.h>

double fahrenheit(double celsius)
{
    return celsius * 9.0 / 5.0 + 32.0;
}

int main(void)
{
    double value;
    puts("Celsius:");
    if (scanf("%lf", &value) != 1 || !(value >= -50 && value <= 100)) {
        return 1;
    }
    printf("%.2f\n", fahrenheit(value));
    return 0;
}
