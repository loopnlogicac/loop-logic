#include <stdio.h>

int main(void)
{
    int value;
    puts("Mark:");
    if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
        return 1;
    }
    int *p = &value;
    *p *= 2;
    printf("%d\n", value);
    return 0;
}
