#include <stdio.h>



int main(void)
{
    auto int total = 0;
    for (register int i = 1; i <= 4; i++) {
        total += i;
    }
    printf("%d\n", total);
    return 0;
}
