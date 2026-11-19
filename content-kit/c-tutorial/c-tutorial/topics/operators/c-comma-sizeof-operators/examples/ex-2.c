#include <stdio.h>

int main(void)
{
    int count = 5;
    size_t bytes = sizeof count++;
    printf("%d %d\n", count, bytes == sizeof(int));
    return 0;
}
