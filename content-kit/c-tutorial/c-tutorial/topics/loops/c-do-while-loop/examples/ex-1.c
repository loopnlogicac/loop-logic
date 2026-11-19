#include <stdio.h>

int main(void)
{
    int limit = 0;
    int count = 0;
    do {
        puts("Attempt");
        count++;
    } while (count < limit);
    printf("Count=%d\n", count);
    return 0;
}
