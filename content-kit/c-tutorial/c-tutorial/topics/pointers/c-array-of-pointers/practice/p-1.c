#include <stdio.h>

int main(void)
{
    int a = 10, b = 20, c = 30, index;
    int *items[] = {&c, &a, &b};
    puts("Slot:");
    if (scanf("%d", &index) != 1 || index < 0 || index > 2) {
        return 1;
    }
    printf("%d\n", *items[index]);
    return 0;
}
