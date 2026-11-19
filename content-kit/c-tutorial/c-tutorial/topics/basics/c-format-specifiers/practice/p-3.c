#include <stdio.h>

int main(void)
{
    double x;
    printf("Input: ");
    if (scanf("%lf", &x) != 1) {
        return 1;
    }
    printf("%.2f %.2e\n", x, x);
    return 0;
}
