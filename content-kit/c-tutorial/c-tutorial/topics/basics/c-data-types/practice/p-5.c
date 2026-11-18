#include <stdio.h>

int main(void)
{
    int roll;
    char grade;
    double cgpa;
    printf("Input: ");
    if (scanf("%d %c %lf", &roll, &grade, &cgpa) != 3) {
        return 1;
    }
    printf("%d %c %.2f\n", roll, grade, cgpa);
    return 0;
}
