#include <stdio.h>

int main(void)
{
    double cgpa;
    printf("Input: ");
    if (scanf("%lf", &cgpa) != 1) {
        return 1;
    }
    printf("CGPA=%.2f\n", cgpa);
    return 0;
}
