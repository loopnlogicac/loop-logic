#include <stdio.h>

int main(void)
{
    int value, flag;
    puts("Value and flag:");
    if (scanf("%d %d", &value, &flag) != 2 || value < -100 || value > 100 ||
        flag < 0 || flag > 1) {
        return 1;
    }
    int *p = NULL;
    if (flag == 1) {
        p = &value;
    }
    if (p == NULL) {
        puts("NONE");
    } else {
        (*p)++;
        printf("%d\n", value);
    }
    return 0;
}
