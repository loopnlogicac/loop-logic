#include <stdio.h>

int main(void)
{
    int roll;
    printf("Input: ");
    if (scanf("%d", &roll) != 1) {
        return 1;
    }
    int written = printf("Roll=%03d\n", roll);
    printf("Written=%d\n", written);
    return 0;
}
