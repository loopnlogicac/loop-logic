#include <stdio.h>

int main(void)
{
    int roll, marks;
    printf("Input: ");
    if (scanf("%d %d", &roll, &marks) != 2) {
        return 1;
    }
    printf("Roll: %d\nLab: %d\n", roll, marks);
    return 0;
}
