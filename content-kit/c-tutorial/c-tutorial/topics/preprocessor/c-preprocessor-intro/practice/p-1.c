#include <stdio.h>

#define GROUP_SIZE 3

int main(void)
{
    int count;
    puts("Group count:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 20) {
        return 1;
    }
    printf("%d\n", count * GROUP_SIZE);
    return 0;
}
