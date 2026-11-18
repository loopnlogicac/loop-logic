#include <stdio.h>

int main(void)
{
    int balance, fee;
    printf("Input: ");
    if (scanf("%d %d", &balance, &fee) != 2) {
        return 1;
    }
    int starting_balance = balance;
    balance = balance - fee;
    printf("Start=%d\nFee=%d\nEnd=%d\n", starting_balance, fee, balance);
    return 0;
}
