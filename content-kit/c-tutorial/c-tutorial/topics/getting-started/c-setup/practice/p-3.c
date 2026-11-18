#include <stdio.h>

int main(void)
{
    int first, second;
    printf("Input: ");
    if (scanf("%d %d", &first, &second) != 2) {
        return 1;
    }
    printf("build-sum=%d\n", first + second);
    return 0;
}
