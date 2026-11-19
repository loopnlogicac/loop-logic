#include <stdio.h>

int main(void)
{
    int roll;
    printf("Input: ");
    if (scanf("%d", &roll) != 1) {
        return 1;
    }
    printf("Welcome\nDouble: %d\n", 2 * roll);
    return 0;
}
