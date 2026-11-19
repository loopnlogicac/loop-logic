#include <stdio.h>
int fee(int hours);
int total(int hours);
int main(void)
{
    printf("%d\n", total(3));
    return 0;
}
int total(int hours)
{
    return fee(hours) + 20;
}
int fee(int hours)
{
    return hours * 40;
}
