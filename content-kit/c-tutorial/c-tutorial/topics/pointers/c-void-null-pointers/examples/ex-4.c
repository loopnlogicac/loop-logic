#include <stdio.h>

int main(void)
{
    int value = 5;
    void *data = &value;
    int result = *data;
    printf("%d\n", result);
    return 0;
}
