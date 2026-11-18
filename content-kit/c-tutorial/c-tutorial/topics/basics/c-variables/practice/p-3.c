#include <stdio.h>

int main(void)
{
    int balance, fare;
    printf("Input: ");
    if (scanf("%d %d", &balance, &fare) != 2) {
        return 1;
    }
    int original = balance;
    balance = balance - fare;
    printf("Before=%d\nAfter=%d\n", original, balance);
    return 0;
}
