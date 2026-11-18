#include <stdio.h>

int main(void)
{
    int marks;
    printf("Input: ");
    if (scanf("%d", &marks) != 1) {
        return 1;
    }
    printf("Marks=%d\n", marks);
    return 0;
}
