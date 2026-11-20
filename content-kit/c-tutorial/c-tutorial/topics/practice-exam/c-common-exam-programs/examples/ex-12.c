#include <stdio.h>

int main(void)
{
    double celsius;
    if (scanf("%lf", &celsius) != 1 || !(celsius >= -100.0 && celsius <= 100.0)) {
        puts("invalid");
        return 0;
    }
    printf("%.1f\n", celsius * 9.0 / 5.0 + 32.0);
    return 0;
}
