#include <stdio.h>

int main(void)
{
    int group1, group2;
    printf("Input: ");
    if (scanf("%d %d", &group1, &group2) != 2) {
        return 1;
    }
    printf("total=%d\n", group1 + group2);
    return 0;
}
