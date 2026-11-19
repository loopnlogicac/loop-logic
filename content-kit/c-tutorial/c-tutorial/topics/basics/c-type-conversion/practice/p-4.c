#include <stdio.h>

int main(void)
{
    int total, group_size;
    printf("Input: ");
    if (scanf("%d %d", &total, &group_size) != 2) {
        return 1;
    }
    printf("Groups=%d\nRemaining=%d\n", total / group_size, total % group_size);
    return 0;
}
