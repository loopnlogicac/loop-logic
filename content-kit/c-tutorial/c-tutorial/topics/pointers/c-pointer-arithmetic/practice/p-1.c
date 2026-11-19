#include <stdio.h>

int main(void)
{
    int values[] = {10, 20, 30, 40};
    int index;
    puts("Index:");
    if (scanf("%d", &index) != 1 || index < 0 || index > 3) {
        return 1;
    }
    printf("%d\n", *(values + index));
    return 0;
}
