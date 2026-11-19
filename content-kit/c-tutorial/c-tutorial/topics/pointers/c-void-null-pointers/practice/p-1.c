#include <stdio.h>

int main(void)
{
    int value;
    puts("Generic int:");
    if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
        return 1;
    }
    void *data = &value;
    int *p = data;
    (*p)++;
    printf("%d\n", value);
    return 0;
}
