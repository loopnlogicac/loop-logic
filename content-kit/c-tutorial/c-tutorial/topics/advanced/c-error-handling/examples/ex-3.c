#include <stdio.h>

enum withdraw_status { WITHDRAW_OK, BAD_AMOUNT, INSUFFICIENT };

static enum withdraw_status withdraw(int *balance, int amount)
{
    if (amount <= 0) {
        return BAD_AMOUNT;
    }
    if (amount > *balance) {
        return INSUFFICIENT;
    }
    *balance -= amount;
    return WITHDRAW_OK;
}

int main(void)
{
    int balance = 500;
    enum withdraw_status first = withdraw(&balance, 600);
    printf("Rejected: %d; balance: %d\n", first == INSUFFICIENT, balance);
    enum withdraw_status second = withdraw(&balance, 120);
    printf("Accepted: %d; balance: %d\n", second == WITHDRAW_OK, balance);
    return 0;
}
