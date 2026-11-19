#include <stdio.h>
int triple(int value);
int main(void)
{
    printf("%d\n", triple(9));
    return 0;
}
int triple(int value)
{
    return value * 3;
}
