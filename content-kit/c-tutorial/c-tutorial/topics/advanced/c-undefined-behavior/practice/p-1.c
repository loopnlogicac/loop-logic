#include <stdio.h>

int main(void)
{
    int values[] = {11, 22, 33, 44};
    int index;
    if (scanf("%d", &index) != 1 || index < 0 || index >= 4) {
        puts("invalid");
        return 0;
    }
    printf("%d\n", values[index]);
    return 0;
}
