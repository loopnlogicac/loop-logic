#include <stdio.h>

int main(void)
{
    int theory, lab;
    printf("Input: ");
    if (scanf("%d %d", &theory, &lab) != 2) {
        return 1;
    }
    printf("Total = %d\n", theory + lab);
    return 0;
}
