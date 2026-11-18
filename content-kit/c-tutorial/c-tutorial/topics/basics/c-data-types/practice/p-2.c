#include <stdio.h>

int main(void)
{
    char grade;
    printf("Input: ");
    if (scanf(" %c", &grade) != 1) {
        return 1;
    }
    printf("Grade=%c\n", grade);
    return 0;
}
