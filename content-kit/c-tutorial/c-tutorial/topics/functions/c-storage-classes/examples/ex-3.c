#include <stdio.h>
static int total;
static void record(int amount)
{
    total += amount;
}
int main(void)
{
    record(25);
    record(15);
    printf("%d\n", total);
    return 0;
}
