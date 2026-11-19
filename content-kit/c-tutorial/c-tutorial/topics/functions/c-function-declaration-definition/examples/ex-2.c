#include <stdio.h>
int larger(int, int);
int main(void)
{
    printf("%d\n", larger(17, 23));
    return 0;
}
int larger(int left, int right)
{
    return left > right ? left : right;
}
