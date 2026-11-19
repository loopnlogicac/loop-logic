#include <stdio.h>

int add_bonus(int mark, int bonus)
{
    return mark + bonus;
}

int main(void)
{
    int total = add_bonus(72, 5);
    printf("%d\n", total);
    return 0;
}
