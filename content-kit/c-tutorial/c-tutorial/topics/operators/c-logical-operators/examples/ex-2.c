#include <stdio.h>

int main(void)
{
    int checks = 0;
    int result = 0 && ++checks;
    printf("%d %d\n", result, checks);
    return 0;
}
