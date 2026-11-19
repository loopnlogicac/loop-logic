#include <stdio.h>

int main(void)
{
    int *selected = NULL;
    if (selected == NULL) {
        puts("No selection");
    }
    int roll = 12;
    selected = &roll;
    printf("%d\n", *selected);
    return 0;
}
