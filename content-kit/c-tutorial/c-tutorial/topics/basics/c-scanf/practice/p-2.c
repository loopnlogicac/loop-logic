#include <stdio.h>

int main(void)
{
    int roll;
    char grade;
    printf("Input: ");
    if (scanf("%d %c", &roll, &grade) != 2) {
        return 1;
    }
    printf("%d %c\n", roll, grade);
    return 0;
}
