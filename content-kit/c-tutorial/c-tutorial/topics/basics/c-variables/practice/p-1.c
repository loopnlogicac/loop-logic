#include <stdio.h>

int main(void)
{
    int marks;
    printf("Input: ");
    if (scanf("%d", &marks) != 1) {
        return 1;
    }
    int result = 0;
    result = marks;
    printf("Updated=%d\n", result);
    return 0;
}
