#include <stdio.h>

int main(void)
{
    int balance, transfer;
    printf("Input: ");
    if (scanf("%d %d", &balance, &transfer) != 2) {
        return 1;
    }
    int left = balance - transfer;
    printf("Left=%d\nMoved=%d\nCheck=%d\n", left, transfer, left + transfer);
    return 0;
}
