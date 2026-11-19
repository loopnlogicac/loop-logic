#include <stdio.h>

int main(void)
{
    int flag, value = 42;
    puts("Available:");
    if (scanf("%d", &flag) != 1 || flag < 0 || flag > 1) {
        return 1;
    }
    int *p = flag ? &value : NULL;
    if (p == NULL) {
        puts("EMPTY");
    } else {
        printf("%d\n", *p);
    }
    return 0;
}
