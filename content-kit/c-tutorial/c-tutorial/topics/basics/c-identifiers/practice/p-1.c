#include <stdio.h>

int main(void)
{
    int roll_number;
    printf("Input: ");
    if (scanf("%d", &roll_number) != 1) {
        return 1;
    }
    printf("roll_number=%d\n", roll_number);
    return 0;
}
