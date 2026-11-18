#include <stdio.h>

int main(void)
{
    int marks;
    printf("Input: ");
    if (scanf("%d", &marks) != 1) {
        return 1;
    }
    /* The exam is marked out of 100. */
    printf("Remaining=%d\n", 100 - marks);
    return 0;
}
