#include <stdio.h>

int main(void)
{
    int marks;
    printf("Input: ");
    if (scanf("%d", &marks) != 1 || marks < 0 || marks > 100) {
        return 1;
    }
    printf("%d\n", marks >= 40);
    return 0;
}
