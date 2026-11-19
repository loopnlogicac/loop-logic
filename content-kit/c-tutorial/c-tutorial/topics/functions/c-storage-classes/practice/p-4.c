#include <stdio.h>
extern int rate;
int main(void)
{
    int units;
    puts("Units:");
    if (scanf("%d", &units) != 1 || units < 0 || units > 100) {
        return 1;
    }
    printf("%d\n", units * rate);
    return 0;
}
int rate = 7;
