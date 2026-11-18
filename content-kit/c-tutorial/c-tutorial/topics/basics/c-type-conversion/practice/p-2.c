#include <stdio.h>

int main(void)
{
    double reading;
    printf("Input: ");
    if (scanf("%lf", &reading) != 1) {
        return 1;
    }
    printf("Whole=%d\n", (int)reading);
    return 0;
}
