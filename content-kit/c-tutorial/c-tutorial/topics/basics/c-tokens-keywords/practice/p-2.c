#include <stdio.h>

int main(void)
{
    int number;
    printf("Input: ");
    if (scanf("%d", &number) != 1) {
        return 1;
    }
    printf("next=%d\n", number + 1);
    return 0;
}
