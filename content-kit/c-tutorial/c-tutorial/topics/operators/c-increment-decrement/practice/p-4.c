#include <stdio.h>

int main(void)
{
    int start;
    printf("Input: ");
    if (scanf("%d", &start) != 1 || start < 0 || start > 1000) {
        return 1;
    }
    int first = start++;
    int second = start++;
    int third = start++;
    printf("%d %d %d %d\n", first, second, third, start);
    return 0;
}
