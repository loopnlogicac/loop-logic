#include <stdio.h>

int main(void)
{
    int roll;
    char grade;
    printf("Input: ");
    if (scanf("%d", &roll) != 1 || scanf(" %c", &grade) != 1) {
        return 1;
    }
    printf("Roll=%d Grade=%c\n", roll, grade);
    return 0;
}
