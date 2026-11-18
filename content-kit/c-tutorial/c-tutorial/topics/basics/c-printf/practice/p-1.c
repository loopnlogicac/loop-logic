#include <stdio.h>

int main(void)
{
    int roll;
    printf("Input: ");
    if (scanf("%d", &roll) != 1) {
        return 1;
    }
    printf("%03d\n", roll);
    return 0;
}
