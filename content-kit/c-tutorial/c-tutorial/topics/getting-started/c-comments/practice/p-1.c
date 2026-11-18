#include <stdio.h>

int main(void)
{
    int count;
    printf("Input: ");
    if (scanf("%d", &count) != 1) {
        return 1;
    }
    // The price is fixed for this lab task.
    printf("Cost=%d\n", count * 5);
    return 0;
}
