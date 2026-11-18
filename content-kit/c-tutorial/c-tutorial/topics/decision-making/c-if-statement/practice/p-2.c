#include <stdio.h>

int main(void)
{
    int flag;
    printf("Input: ");
    if (scanf("%d", &flag) != 1 || flag < -10 || flag > 10) {
        return 1;
    }
    if (flag) {
        puts("Active");
    }
    puts("End");
    return 0;
}
