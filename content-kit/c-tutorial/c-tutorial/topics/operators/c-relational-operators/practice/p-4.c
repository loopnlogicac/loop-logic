#include <stdio.h>

int main(void)
{
    double a, b;
    printf("Input: ");
    if (scanf("%lf %lf", &a, &b) != 2 || a < -1000 || a > 1000
        || b < -1000 || b > 1000) {
        return 1;
    }
    double difference = a - b;
    if (difference < 0) {
        difference = -difference;
    }
    printf("%d\n", difference <= 0.01);
    return 0;
}
