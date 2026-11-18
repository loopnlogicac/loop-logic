#include <stdio.h>

int main(void)
{
    int value;
    printf("Input: ");
    if (scanf("%d", &value) != 1) {
        return 1;
    }
    printf("lab\\group%d\n", value);
    return 0;
}
