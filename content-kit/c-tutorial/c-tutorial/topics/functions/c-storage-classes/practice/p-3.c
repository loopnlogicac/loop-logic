#include <stdio.h>
static int stock = 20;
static void sell(int count)
{
    stock -= count;
}
int main(void)
{
    int count;
    puts("Sale:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 20) {
        return 1;
    }
    sell(count);
    printf("%d\n", stock);
    return 0;
}
